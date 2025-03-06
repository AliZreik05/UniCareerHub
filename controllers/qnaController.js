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
    const {title,question} = req.body;            //,category
    const user = req.user.username;
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

const handleReply = async(req,res) =>
{
    const {ID,reply} = req.body;
    const user = req.user.username;
    const replyTime = format(new Date(), "dd/MM/yyyy hh:mm:ss a");
    questionsDB.questions.forEach(userObj => 
        {
            userObj.questions.forEach
            (
                q=> 
                {
                    if (q.ID === ID)
                    {
                        if (!q.replies || !Array.isArray(q.replies)) 
                        {
                            q.replies = [];
                        }
                        q.replies.push(
                            {
                                user: user, reply: reply,time: replyTime,
                            }
                        )
                    }
                }
            );
        });
        try 
        {
            await fsPromises.writeFile(
              path.join(__dirname, '..', 'model', 'questions.json'),
              JSON.stringify(questionsDB.questions, null, 2)
            );
            return res.status(200).json({ message: 'Reply posted successfully' });
          } catch (error) 
          {
            console.error("Error writing to file:", error);
            return res.status(500).json({ message: 'Server error' });
          }
}
module.exports = {postQuestion,getLatestQuestions,handleReply};