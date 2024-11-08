import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise.js'
import { configDB } from './configDB.js'
const PORT=3000

let connection 
try {
    connection=await mysql.createConnection(configDB)
} catch (error) {
    console.log(error);
    
}

const app=express()
app.use(express.json())
app.use(cors())

app.get('/todos',async(req,res)=>{
    try {
        const sql="SELECT * FROM todos ORDER BY timestamp"
        const[rows,fields] = await connection.execute(sql)
        res.send(rows)
    } catch (error) {
        console.log(error);
        
    }
})

app.post('/todos',async(req,res)=>{
    const {task} = req.body
    if(!task) return res.json({msg:'Hianyzo adat!'})
    try {
        const sql="insert into todos (task) values (?)"
        const values=[task]
        const[rows,fields] = await connection.execute(sql,values)
        console.log(rows,fields);
        res.json({msg:'Sikeres hozzáadás!'})
    } catch (error) {
        console.log(error);
        
    }
})

app.delete('/todos/:id',async(req,res)=>{
    const {id} = req.params
  
    try {
        const sql="DELETE FROM todos WHERE id=?"
        const values=[id]
        const[rows,fields] = await connection.execute(sql,values)
        console.log(rows.affectedRows );
        res.json({msg:`${rows.affectedRows==0 ? "Nincstörlendő adat!": "Sikeres törlés!"}`})
    } catch (error) {
        console.log(error);
        
    }
})
app.put('/todos/completed/:id',async(req,res)=>{
    const {id} = req.params
    try {
        const sql="UPDATE todos SET completed=NOT completed WHERE id=?"
        const values=[id]
        const[rows,fields] = await connection.execute(sql,values)
        console.log(rows);
        res.json({msg:`${rows.affectedRows==0 ? "Nincs modositando adat!": "Sikeres modositas!"}`})
    } catch (error) {
        console.log(error);
        
    }
})
app.put('/todos/task/:id',async(req,res)=>{
    const {id} = req.params
    const {task} = req.body
    try {
        const sql="UPDATE todos SET task = ? where id = ?"
        const values=[task,id]
        const[rows,fields] = await connection.execute(sql,values)
        console.log(rows);
        res.json({msg:`${rows.affectedRows==0 ? "Nincs modositando adat!": "Sikeres modositas!"}`})
    } catch (error) {
        console.log(error);
        
    }
})
app.listen(PORT,( )=>console.log(
 `serverlistening on port: ${PORT}`));