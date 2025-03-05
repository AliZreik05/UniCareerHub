const fsPromises = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const questionsDB = 
{
    questions: require('../model/questions.json'),
    setQuestions: function (data) { this.questions = data }
};

const postQuestion = async (req,res)=>
{
    const dateTime = format(new Date(), "dd/MM/yyyy hh:mm a");
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
        existingUser.questions.push({ "title":title,"question":question, "time": dateTime })
    }
    await fsPromises.writeFile
    (
        path.join(__dirname, '..', 'model', 'questions.json'),
        JSON.stringify(questionsDB.questions)
    );
    return res.status(200).json({ message: 'Question posted successfully' });

}
module.exports = {postQuestion};