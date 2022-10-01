// promised-sqlite 3

// const { PromisedDatabase } = require("promised-sqlite3"); // import the class
 
// const db = new PromisedDatabase(); // create a instance of PromisedDatabase
// // note: at this stade, the wrapped sqlite3.Database object is not created.
 
// async function init() {
//     try {
//         await db.open("./db.sqlite"); // create a sqlite3.Database object & open the database on the passed filepath.
 
//         // run some sql request.
//         await db.run("CREATE TABLE IF NOT EXISTS foo (id INTEGER PRIMARY KEY AUTOINCREMENT, a TEXT NOT NULL, b TEXT)"); 
//         await db.run("INSERT INTO foo (a, b) VALUES (?, ?)", "alpha", "beta");
//         await db.run("INSERT INTO foo (a, b) VALUES ($goo, $hoo)", { $goo: "GOO !", $hoo: "HOO :" });
//         await db.run("INSERT INTO foo (a, b) VALUES (?, ?)", ["Value of a", "Value of b"]);
 
//         // read database
//         const row = await db.get("SELECT * FROM foo WHERE id = ?", 2);
//         console.log(row);
 
//         const rows = await db.all("SELECT * FROM foo");
//         console.log(rows);
 
//         await db.each("SELECT * FROM foo WHERE id > ?", 5,
//             function(row) {
//                 console.log(row);
//             }
//         );
 
//         // get the wrapped sqlite3.Database object
//         const sqliteDB = db.db;
 
//         // close the database
//         await db.close();
 
//     } catch(err) {
//         console.error(err);
//     }
// }
 
// init();


// sqlite 3

// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database(':memory:');

// db.serialize(() => {
//     db.run("CREATE TABLE lorem (info TEXT)");

//     const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (let i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
//         console.log(row.id + ": " + row.info);
//     });
// });

// db.close();



// database

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('exam.db');

// function promisify(d){
//     return new Promise((req,res)=>{
        
//     })
// }
// db.serialize(() => {
//     db.run("CREATE TABLE lorem (info TEXT)");

//     const stmt = db.prepare
//     ("INSERT INTO lorem VALUES (?)");
//     for (let i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
//         console.log(row.id + ": " + row.info);
//     });
// });
 
// db.close();

function createTables(){
    let exam_query = `
    create table exam(id integer primary key, 
    exam_date date not null, topic varchar(50) not null)
`
    let question_query = `
    create table question(id integer primary key, 
                question_text text not null,
                answer int not null,
                options text not null,
                exam_id integer not null,
                foreign key(exam_id) references exam(id))`

    db.serialize(()=>{
        
        db.run(exam_query)
        console.log("exam table created!!")
        db.run(question_query)
        console.log("question table created!!")

    })
    

}

// export function createExam(exam_date,topic){ 
//     const [year,month,day] = exam_date.split(/[-/]/)
//     try {
//         db.run(`insert into exam(exam_date,topic) values(?,?)`,
//         [new Date(year,month,day),topic])
//     } catch (error) {
//         console.log(error)
//     }
// }

// export function getExams(){
//     db.all("select * from exam", (err, rows)=>{
//         if(err){
//             console.log(err)
//         }else{
//             console.log(rows)
//         }
//     })    

    
// }

const util = require("util")
// const run = util.promisify(db.run)



async function getExams(){

    const db = new sqlite3.Database('exam.db');
    const all = util.promisify(db.all)

    try {
        const rows = await all.call(db,"select * from exam")
        return rows
        
    } catch (error) {
        console.log(error)
        return []
    }
    finally{
        db.close()
    }
}

async function getQuestions(exam_id){

    const db = new sqlite3.Database('exam.db');
    const all = util.promisify(db.all)
    let option = exam_id?` where exam_id = ${exam_id}`:""
    let query = `select * from question ${option}`

    try {
        const rows = await all.call(db,query)
        return rows
        
    } catch (error) {
        console.log(error)
        return []
    }
    finally{
        db.close()
    }
}

function createExam(exam_date,topic){ 
    const db = new sqlite3.Database('exam.db');
    const run = util.promisify(db.run)
    let [year,month,day] = exam_date.split(/[-/]/)
    month = parseInt(month)-1
    try {
        run.call(db,`insert into exam(exam_date,topic) values(?,?)`,
        [new Date(year,month,day),topic])
        return "success"
    } catch (error) {
        console.log(error)
        return "failure"
    }
    finally{
        db.close()
    }
}

function createQuestion(exam_id,question_text,options,actual_answer){ //actual answer is int
    const db = new sqlite3.Database('exam.db');
    const run = util.promisify(db.run)
    try {
        run.call(db,`insert into question(question_text,options,answer,exam_id) 
                    values(?,?,?,?)`,
        [question_text,options,actual_answer,exam_id])
        return "success"
    } catch (error) {
        console.log(error)
        return "failure"
    }
    finally{
        db.close()
    }
}

module.exports = {
    getQuestions,
    getExams,
    createExam,
    createQuestion
}
createTables()
createExam("2022/12/21","CO")
// createExam("2022/12/18","CG")
// createExam("2022/12/19","LD")
getExams()
createQuestion(1,"Which is capital of India?",
    "Delhi#Bangalore#Mumbai#Chennai",0)

// createQuestion(1,"Who is PM of India?",
//     "Deve Gowda#Indira Gandhi#Modi#Rahul Gandhi",2)

// createQuestion(1,"Which is capital of Karnataka?",
//     "Delhi#Bangalore#Mumbai#Chennai",1)
// foo()
// getQuestions(1).then(d=>console.log(d))