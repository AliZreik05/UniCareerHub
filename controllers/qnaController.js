const fsPromises = require('fs').promises;
const path = require('path');
const { format, parse } = require('date-fns');
const dateFormat = "dd/MM/yyyy hh:mm:ss a";
const crypto = require('crypto');

const questionsDB = 
{
    questions: require('../model/questions.json'),
    setQuestions: function (data) { this.questions = data }
};

const postQuestion = async (req,res)=>
{
    const postId = crypto.randomUUID();
    const dateTime = format(new Date(), "dd/MM/yyyy hh:mm:ss a");
    const {user,title,question} = req.body;            //,category
    const existingUser = questionsDB.questions.find(person => person.username===user);
    if(!existingUser)
    {
        const newAsker = 
        {
            "username": user,
            "questions": 
            [
                {
            "ID" : postId,
            "title": title,
            "question": question,
            //"category": category,
            "time": dateTime,
                }
            ]
        }
        questionsDB.setQuestions([...questionsDB.questions, newAsker]);
    }
    else
    {
        existingUser.questions.push({ "ID" : postId,"title":title,"question":question, "time": dateTime })
    }
    await fsPromises.writeFile
    (
        path.join(__dirname, '..', 'model', 'questions.json'),
        JSON.stringify(questionsDB.questions)
    );
    return res.status(200).json({ message: 'Question posted successfully' });
}
const getLatestQuestions = async(req,res)=>
{
    try
    {
        const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'questions.json'), 'utf8');
        const questionsDB = JSON.parse(data);
        const listOfQuestions = [];
        questionsDB.forEach(userObj => 
        {
            userObj.questions.forEach
            (
                q=> 
                {
                    listOfQuestions.push({ ...q, username: userObj.username });
                }
            );
        });
        listOfQuestions.sort((a, b) => 
            {
            const dateA = parse(a.time, dateFormat, new Date());
            const dateB = parse(b.time, dateFormat, new Date());
            return dateB - dateA;
            });
          const latest10 = listOfQuestions.slice(0, 10);
          res.status(200).json(latest10);
    }
    catch (error) 
    {
        console.error(error);
        res.status(500).send("Server error");
    }
}

const handleReply = (req,res) =>
{
    const {user,reply} = req.body;
    const existingUser = questionsDB.questions.find(person => person.username===user);

}
module.exports = {postQuestion,getLatestQuestions};