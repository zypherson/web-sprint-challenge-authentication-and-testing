/* eslint-disable no-unused-vars */
const db = require('../../data/dbConfig')


  

  async function add(user) {
    const [id] = await db('users').insert(user)
    return db('users')
    .where({id}).first()
  }

  function findBy(username) {
    return db('users').where({username}).first()
  }
  
  module.exports = {
    add,
    findBy
 }