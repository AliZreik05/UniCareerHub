const fsPromises = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { format } = require('date-fns');
const reviewsDB = 
{
    reviews: require('../model/reviews.json'),
    setReviews: function (data) { this.reviews = data }
};

const postReview = async (req,res)=>
{
    const dateTime = format(new Date(), "dd/MM/yyyy hh:mm a");
    const {operation,user,company,review} = req.body;            //,category
    if(operation === 'remove')
    {
        const existingUser = reviewsDB.reviews.find(person => person.username === user);
        if (existingUser) 
        {
            existingUser.reviews = existingUser.reviews.filter(r => !(r["company-name"] === company && r.review === review));
            reviewsDB.setReviews(reviewsDB.reviews.filter(person => person.username !== user || person.reviews.length > 0))
          
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'reviews.json'),
            JSON.stringify(reviewsDB.reviews))
        }
        return res.redirect('/reviews');
    }
    else
    {
    const existingUser = reviewsDB.reviews.find(person => person.username===user);
    if(!existingUser)
    {
        const newReviewer = 
        {
            "username": user,
            "reviews": 
            [
                {
            "company-name": company,
            "review": review,
            //"category": category,
            "time": dateTime,
                }
            ]
        }
        reviewsDB.setReviews([...reviewsDB.reviews, newReviewer]);
    }
    else
    {
        existingUser.reviews.push({ "company-name": company, "review": review, "time": dateTime })
    }
    await fsPromises.writeFile
    (
        path.join(__dirname, '..', 'model', 'reviews.json'),
        JSON.stringify(reviewsDB.reviews)
    );
    return res.status(200).json({ message: 'Review posted successfully' });
}
}
module.exports = {postReview};