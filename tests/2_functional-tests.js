/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testId;

describe("Functional Tests", () => {
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */

  it("#example Test GET /api/books", ( done ) => {
    chai
    .request( server )
    .get( "/api/books" )
    .end(( err, res ) => {
      if( err ) console.log( err );

      assert.equal(res.status, 200);
      assert.isArray(res.body, 'response should be an array');
      assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
      assert.property(res.body[0], 'title', 'Books in array should contain title');
      assert.property(res.body[0], '_id', 'Books in array should contain _id');
      done();
    });
  });

  /*
  * ----[END of EXAMPLE TEST]----
  */

  describe("Routing tests", () => {

    describe("POST /api/books with title => create book object/expect book object", () => {

      it("Test POST /api/books with title", ( done ) => {
        chai
        .request( server )
        .post("/api/books")
        .send({
          title: "testTitle"
        })
        .then(( res ) => {
          testId = res.body._id;

          assert.equal( res.status, 200 );
          assert.typeOf( res.body, "object" );
          assert.property( res.body, "_id" );
          assert.property( res.body, "title" );
          done();
        })
        .catch(( err ) => console.log( err ));
      });

      it("Test POST /api/books with no title given", ( done ) => {
        chai
        .request( server )
        .post("/api/books")
        .set("content-type", "application/json")
        .send({})
        .then(( res ) => {
          assert.equal( res.status, 200 );
          assert.equal( res.text, "missing required field title" );
          done();
        })
        .catch(( err ) => console.log( err ));
      });

    });

    describe("GET /api/books => array of books", () => {

      it("Test GET /api/books", ( done ) => {
        chai
        .request( server )
        .get("/api/books")
        .end(( err, res ) => {
          if( err ) console.log( err );

          assert.equal( res.status, 200 );
          assert.typeOf( res.body, "array" )
          done();
        });
      });

    });

    describe("GET /api/books/[id] => book object with [id]", () => {

      it("Test GET /api/books/[id] with id not in db", ( done ) => {
        chai
        .request( server )
        .get(`/api/books/171ab2cb841ff43b14ebd739`)
        .end(( err, res ) => {
          if( err ) console.log( err );

          assert.equal( res.status, 200 );
          assert.equal( res.text, "no book exists" );
          done();
        });
      });

      it("Test GET /api/books/[id] with valid id in db", ( done ) => {
        chai
        .request( server )
        .get(`/api/books/${testId}`)
        .end(( err, res ) => {
          if( err ) console.log( err );

          assert.equal( res.status, 200 );
          assert.typeOf( res.body, "object" );
          assert.property( res.body, "_id" );
          assert.property( res.body, "title" );
          assert.property( res.body, "comments" );
          assert.typeOf( res.body.comments, "array" );
          done();
        });
      });

    });

    describe("POST /api/books/[id] => add comment/expect book object with id", () => {

      it("Test POST /api/books/[id] with comment", ( done ) => {
        chai
        .request( server )
        .post(`/api/books/${testId}`)
        .send({
          id: testId,
          comment: "test comment"
        })
        .then(( res ) => {
          assert.equal( res.status, 200 );
          assert.typeOf( res.body, "object" );
          assert.property( res.body, "_id" );
          assert.property( res.body, "title" );
          assert.property( res.body, "commentcount" );
          assert.property( res.body, "comments" );
          assert.typeOf( res.body.comments, "array" )
          done();
        })
        .catch(( err ) => console.log( err ));
      });

      it("Test POST /api/books/[id] without comment field", ( done ) => {
        chai
        .request( server )
        .post(`/api/books/${testId}`)
        .send({
          id: testId,
        })
        .then(( res ) => {
          assert.equal( res.status, 200 );
          assert.equal( res.text, "missing required field comment" );
          done();
        })
        .catch(( err ) => console.log( err ));
      });

      it("Test POST /api/books/[id] with comment, id not in db", ( done ) => {
        chai
        .request( server )
        .post(`/api/books/171ab2cb841ff43b14ebd739`)
        .send({
          id: "171ab2cb841ff43b14ebd739",
          comment: "test comment"
        })
        .then(( res ) => {
          assert.equal( res.status, 200 );
          assert.equal( res.text, "no book exists" );
          done();
        })
        .catch(( err ) => console.log( err ));
      });
      
    });

    describe("DELETE /api/books/[id] => delete book object id", () => {

      it("Test DELETE /api/books/[id] with valid id in db", ( done ) => {
        chai
        .request( server )
        .delete(`/api/books/${testId}`)
        .send({
          id: testId
        })
        .then(( res ) => {
          assert.equal( res.status, 200 );
          assert.equal( res.text, "delete successful" );
          done()
        })
        .catch(( err ) => console.log( err ));
      });

      it("Test DELETE /api/books/[id] with id not in db", ( done ) => {
        chai
        .request( server )
        .delete(`/api/books/171ab2cb841ff43b14ebd739`)
        .send({
          id: "171ab2cb841ff43b14ebd739"
        })
        .then(( res ) => {
          assert.equal( res.status, 200 );
          assert.equal( res.text, "no book exists" );
          done()
        })
        .catch(( err ) => console.log( err ));
      });

    });

  });

});
