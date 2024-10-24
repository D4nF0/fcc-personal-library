/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const BookModel = require("../models").Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      BookModel.find().then(( data ) => {
        const mappedData = data.map( e => {
          return {
            _id: e._id,
            title: e.title,
            commentcount: e.commentcount || 0,
            comment: e.comments,
          };
        });

        res.json( mappedData );
      });
      
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      const title = req.body.title;

      if( !title ){
        res.send( "missing required field title" );
        return;
      };

      const newBook = new BookModel({
        title,
        commentcount: 0,
      });

      newBook.save().then(( savedData ) => {
        if( savedData ){
          res.json({
            _id: savedData._id, 
            title: savedData.title,
          });
          
        } else {
          res.send({ error: "error has occured" });
        };
      }).catch(( err ) => {
        console.log( err );
        res.send({ error: "error has occured" });
      });

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      BookModel.deleteMany().then(( removedData ) => {
        if( removedData.acknowledged == true ){
          res.send( "complete delete successful" );
        };
      });

    });


  app.route('/api/books/:id')
    .get(function (req, res){
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const _id = req.params.id;

      BookModel.findById({ _id }).then(( data ) => {
        if( !data ){
          res.send( "no book exists" );
          return;
        }

        res.json({
          _id: data._id,
          title: data.title,
          comments: data.comments
        });

      }).catch(( err ) => {
        console.log( err );
        res.send( "no book exists" );
      });
    
    })
    
    .post(function(req, res){
      //json res format same as .get
      const _id = req.params.id;
      const comment = req.body.comment;

      if( !comment ){
        res.send( "missing required field comment" );
        return;
      }
    
      BookModel.findById({ _id }).then(( data ) => {
        if( !data ){
          res.send( "no book exists" );
          return;
        };

        data.comments.push( comment );
        data.commentcount = ( data.commentcount == "" ) ? 1 : data.commentcount+1; ;

        data.save().then(( savedData ) => {
          if( !savedData ){
            res.send({ error: "error has occured" });
            return;
          };

          res.json({
            _id: savedData._id,
            title: savedData.title,
            commentcount: savedData.commentcount,
            comments: savedData.comments,
          });

        }).catch(( err ) => {
          console.log( err );
          res.send({ error: "error has occured" });
        });

      }).catch(( err ) => {
        console.log( err );
        res.send( "no book exists" );
      });
    
    })
    
    .delete(function(req, res){
      //if successful response will be 'delete successful'
      const _id = req.params.id;

      BookModel.findByIdAndDelete({ _id }).then(( data ) => {
        if( !data ){
          res.send( "no book exists" );
          return;
        }

        res.send( "delete successful" );

      }).catch(( err ) => {
        console.log( err );
        res.send( "no book exists" );
      });

    });

};
