const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE 
}); 


// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// user login
app.post('/login', (req, res) => {
    const usernameToCheck = req.body.username;
    const password = req.body.userpass;
    const roleType = req.body.roleType;
    db.query(`SELECT * FROM gymManagement.${roleType} where username = ? and password = ?`, [usernameToCheck,password], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(results);
      }
    });
  });
  
  
// Get user member profile
app.get('/profile', (req, res) => {
  const usernameToCheck = req.query.userid;
  db.query('SELECT * FROM gymManagement.member where member_id = ?', [usernameToCheck], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});


  // Get all trainers
app.get('/alltrainers', (req, res) => {
  db.query('SELECT * FROM gymManagement.trainer', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});


// Get all members
app.get('/allusers', (req, res) => {
  const usernameToCheck = req.query.userid;
  db.query('SELECT * FROM gymManagement.member', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

// Get all members with membership plan details for admin
app.get('/manageallusers', (req, res) => {
  db.query('SELECT * FROM gymManagement.member m LEFT JOIN gymManagement.membership_plan mp ON m.membership_plan_id = mp.membership_plan_id', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

// Get all members with membership plan details
app.get('/getMembershipForUsers', (req, res) => {
  const usernameToCheck = req.query.userid;
  db.query('SELECT * FROM gymManagement.member m LEFT JOIN gymManagement.membership_plan mp ON m.membership_plan_id = mp.membership_plan_id where m.member_id = ?', [usernameToCheck], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

//update user
app.post('/updateuser', (req, res) => {
  const {
    username,
    password,
    phone_no,
    email,
    fname,
    lname,
    age,
    gender,
    address,
    membership_status,
    dateOfExpiry,
    dateOfRegistration,
    membership_plan_id,
    userId
  } = req.body;

  const memberUpdateData = {
    username: username,
    password: password,
    fname: fname,
    lname: lname,
    age: age,
    gender: gender,
    email: email,
    phone_no:phone_no,
    address: address,
    membership_status: membership_status,
    dateOfExpiry: dateOfExpiry,
    dateOfRegistration: dateOfRegistration,
    membership_plan_id: membership_plan_id
  };

  // Insert into user table
  db.query(
    'UPDATE  gymManagement.user SET username = ?, password =?, phone_no = ?, email = ? WHERE user_id = ?',
    [username, password, phone_no, email, userId],
    (err, result) => {
      if (err) {
        console.error('Error inserting into user table:', err);
        return res.status(500).send('Internal Server Error');
      }

      // Get the inserted user_id
      db.query(
        'UPDATE gymManagement.member SET ? where member_id = ?',
        [memberUpdateData,
          userId
        ],
        (err) => {
          if (err) {
            console.error('Error inserting into member table:', err);
            return res.status(500).send('Internal Server Error');
          }

          res.status(200).send('Update successful');
        }
      );
    }
  );
});


// add trainer using procedure addTrainerProcedure
app.post('/addtrainer', (req, res) => {
  addTrainerProcedure(req.body, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to add trainer' });
    } else {
      res.status(200).json({ message: 'Trainer added successfully', results });
    }
  });
});

// Route to handle user registration using procedure 
app.post('/register', (req, res) => {
  callProcedureAddMember(req.body, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to add member' });
    } else {
      res.status(200).json({ message: 'Member added successfully', results });
    }
  });
});


  // Check if email exists
app.get('/uuemailcheck', (req, res) => {
  const emailToCheck = req.query.email;
  if (!emailToCheck) {
    res.status(400).send('Email is required');
    return;
  }
  db.query('SELECT * FROM gymManagement.user WHERE email = ?', [emailToCheck], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      // Check if any results were returned
      if (results.length > 0) {
        res.json({ exists: true });
      } else {
        res.json([]);
      }
    }
  });
});

  // Check if username exists
  app.get('/usernamecheck', (req, res) => {
    const usernameToCheck = req.query.username;
    if (!usernameToCheck) {
      res.status(400).send('Username is required');
      return;
    }
  
    db.query('SELECT * FROM gymManagement.user WHERE username = ?', [usernameToCheck], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        // Check if any results were returned
        if (results.length > 0) {
          res.json({ exists: true });
        } else {
          res.json([]);
        }
      }
    });
  });
  
  
//   // Route to get gym class schedules
// app.get('/class-schedules', (req, res) => {
//   // Query to fetch class schedules
//   const query = `
//       SELECT 
//           class_id,
//           class_name,
//           schedule,
//           duration,
//           capacity
//       FROM 
//           gymManagement.ClassSchedule;
//   `;

//   // Execute the query
//   db.query(query, (err, results) => {
//       if (err) {
//           console.error('Error executing query:', err);
//           res.status(500).send('Internal Server Error');
//       } else {
//           res.json(results);
//       }
//   });
// });

// Route to store feedback
app.post('/feedback', (req, res) => {
  const { feedback_text, member_id, dateOfFeedback } = req.body;

  const feedback = {
    feedback_text,
    member_id,
    dateOfFeedback
  };

  // Insert feedback into the 'Feedback' table
  db.query('INSERT INTO gymManagement.feedback SET ?', feedback, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Feedback stored successfully', feedbackId: results.insertId });
    }
  });
});

// Many to many table update
app.post('/trainer-trains-member', (req, res) => {
  const { trainer_id, member_id } = req.body;

  const data = {
    trainer_id,
    member_id,
  };

    // Insert feedback into the 'Feedback' table
    db.query('SELECT * from gymManagement.trainer_trains_member WHERE trainer_id =? and member_id =?', [trainer_id,member_id], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
     if(res.length == 0){
  // Insert feedback into the 'Feedback' table
  db.query('INSERT INTO gymManagement.trainer_trains_member SET ?', data, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'trainer_trains_member stored successfully', feedbackId: results.insertId });
    }
  });
  res.json({ message: 'trainer_trains_member stored successfully', feedbackId: results.insertId });
}
}
});
});

// Many to many table update
app.post('/member_completes_workoutClassInstance', (req, res) => {
  const { workout_class_instance_id, member_id } = req.body;

  const data = {
    workout_class_instance_id,
    member_id,
  };
  db.query('SELECT * from  gymManagement.member_completes_workoutClassInstance WHERE member_id =? and workout_class_instance_id =?', [member_id,workout_class_instance_id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      if(res.length == 0){
  db.query('INSERT INTO gymManagement.member_completes_workoutClassInstance SET ?', data, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'member_completes_workoutClassInstance stored successfully', feedbackId: results.insertId });
    }
  });
  
  res.json({ message: 'member_completes_workoutClassInstance stored successfully', feedbackId: results.insertId });
}
    }
});
});


// Route to add invoice using procedure
app.post('/addinvoice', (req, res) => {
  generateInvoiceProcedure(req.body, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to generate Invoice' });
    } else {
      res.status(200).json({ message: 'Invoice generated successfully', results });
    }
  });
});

// Route to add equipment
app.post('/add-equipment', (req, res) => {
  const { name, description, management_id, last_maintenance_date} = req.body;

  const membershipPlan = {
    name,
    description,
    management_id,
    last_maintenance_date
  };
  db.query('INSERT INTO gymManagement.gym_equipment SET ?', membershipPlan, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Membership plan stored successfully', planId: results.insertId });
    }
  });
});


app.post('/addclass', (req, res) => {
  const { class_name, duration, timings, trainer_id, equipment_id} = req.body;

    db.query(
    'INSERT INTO workout_class (class_name) VALUES (?)',
    [class_name],
    (err, result) => {
      if (err) {
        console.error('Error inserting into workout_class table:', err);
        return res.status(500).send('Internal Server Error');
      }

      // Get the inserted user_id
      const class_id = result.insertId;

      console.log("class_id",class_id)
      // Insert into member table
      db.query(
        'INSERT INTO workout_class_instance (class_name, duration, timings, trainer_id, workout_class_id) VALUES (?, ?, ?, ?, ?)',
        [
          class_name,
          duration,
          timings,
          trainer_id,
          class_id
        ],
        (err) => {
          if (err) {
            console.error('Error inserting into workout_class_instance table:', err);
            return res.status(500).send('Internal Server Error');
          }

          db.query(
            'INSERT INTO workoutClass_uses_gymEquipment (workout_class_id,equipment_id) VALUES (?, ?)',
            [class_id,equipment_id],
            (err, result) => {
              if (err) {
                console.error('Error inserting into workoutClass_uses_gymEquipment table:', err);
                return res.status(500).send('Internal Server Error');
              }
              else{
              res.status(200).send('Class instance added successful');
              }
            });
          
        }
      );
    }
  );
});

// Route to store membership plans using procedure
app.post('/add-package', (req, res) => {

  addMembershipPlanProcedure(req.body, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to add membership plan' });
    } else {
      res.status(200).json({ message: 'Membership plan added successfully', results });
    }
  });
});

// Route to store attendance
app.post('/store-attendance', (req, res) => {
  const { user_id, check_in_time, check_out_time, date, class_id } = req.body;

  const attendance = {
    user_id,
    check_in_time,
    check_out_time,
    date,
    class_id
  };

  // Insert attendance into the 'Attendance' table
  db.query('INSERT INTO gymManagement.Attendance SET ?', attendance, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Attendance stored successfully', attendanceId: results.insertId });
    }
  });
});

// Route to store workout plans
app.post('/store-workout-plan', (req, res) => {
  const { trainer_id, plan_name, description, duration } = req.body;

  const workoutPlan = {
    trainer_id,
    plan_name,
    description,
    duration
  };

  // Insert workout plan into the 'WorkoutPlan' table
  db.query('INSERT INTO gymManagement.WorkoutPlan SET ?', workoutPlan, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Workout plan stored successfully', planId: results.insertId });
    }
  });
});

// Update the membership plan bought by the user
app.post('/update-package-details', (req, res) => {
  const { membership_plan_id, user_id, dateOfRegistration, dateOfExpiry} = req.body;
  let status =""; // will update using trigger
  // Update class schedule in the 'ClassSchedule' table
  db.query('UPDATE gymManagement.member SET membership_plan_id=?, membership_status=?, dateOfRegistration=?, dateOfExpiry=? WHERE member_id=?', [membership_plan_id, status, dateOfRegistration, dateOfExpiry, user_id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Membership updated successfully', affectedRows: results.affectedRows });
    }
  });
});
      
//cancel membership 
app.post('/cancelMembership', (req, res) => {
  const { member_id} = req.body;
  // Update class schedule in the 'ClassSchedule' table
  db.query('UPDATE gymManagement.member SET membership_status=? WHERE member_id=?', ["InActive",member_id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Membership updated successfully', affectedRows: results.affectedRows });
    }
  });
});

// Route to modify class schedule
app.put('/modify-class-schedule/:classId', (req, res) => {
  const { schedule, duration, capacity } = req.body;
  const classId = req.params.classId;

  // Update class schedule in the 'ClassSchedule' table
  db.query('UPDATE gymManagement.ClassSchedule SET schedule=?, duration=?, capacity=? WHERE class_id=?', [schedule, duration, capacity, classId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Class schedule modified successfully', affectedRows: results.affectedRows });
    }
  });
});
                    
// Route to add gym equipment
app.post('/add-gym-equipment', (req, res) => {
  const { name, description, manufacturer, last_maintenance_date, next_maintenance_date } = req.body;

  const gymEquipment = {
    name,
    description,
    manufacturer,
    last_maintenance_date,
    next_maintenance_date
  };

  // Insert gym equipment into the 'GymEquipment' table
  db.query('INSERT INTO gymManagement.GymEquipment SET ?', gymEquipment, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Gym equipment added successfully', equipmentId: results.insertId });
    }
  });
});

// Route to add trainer
app.post('/add-trainer', (req, res) => {
  const { name, specialization, phone } = req.body;

  const trainer = {
    name,
    specialization,
    phone
  };

  // Insert trainer into the 'Trainer' table
  db.query('INSERT INTO gymManagement.Trainer SET ?', trainer, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Trainer added successfully', trainerId: results.insertId });
    }
  });
});

// Route to delete user
app.delete('/deleteuser', (req, res) => {
  const userId = req.query.userid;

  // Delete user from the 'User' table
  db.query('DELETE FROM gymManagement.user WHERE user_id = ?', [userId], (err, results) => {
    if (err) {a
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'User deleted successfully', affectedRows: results.affectedRows });
    }
  });
});



// Route to delete package
app.delete('/deleteEquipment', (req, res) => {
  const equipmentid = req.query.equipmentid;

  // Delete user from the 'User' table
  db.query('DELETE FROM gymManagement.gym_equipment WHERE equipment_id = ?', [equipmentid], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Plan deleted successfully', affectedRows: results.affectedRows });
    }
  });
});

// Route to delete package
app.delete('/deletepackage', (req, res) => {
  const planId = req.query.planId;

  // Delete user from the 'User' table
  db.query('DELETE FROM gymManagement.membership_plan WHERE membership_plan_id = ?', [planId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Plan deleted successfully', affectedRows: results.affectedRows });
    }
  });
});


// Route to delete trainer
app.delete('/delete-trainer/:trainerId', (req, res) => {
  const trainerId = req.params.trainerId;

  // Delete trainer from the 'Trainer' table
  db.query('DELETE FROM gymManagement.Trainer WHERE trainer_id = ?', [trainerId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Trainer deleted successfully', affectedRows: results.affectedRows });
    }
  });
});

// Route to delete gym equipment
app.delete('/delete-gym-equipment/:equipmentId', (req, res) => {
  const equipmentId = req.params.equipmentId;

  // Delete gym equipment from the 'GymEquipment' table
  db.query('DELETE FROM gymManagement.GymEquipment WHERE equipment_id = ?', [equipmentId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Gym equipment deleted successfully', affectedRows: results.affectedRows });
    }
  });
});



  //get all equipment 
  app.get('/allEquipments', (req, res) => {
    db.query('SELECT * FROM gymManagement.gym_equipment', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.error('results:', results);
        // Check if any results were returned
        if (results.length > 0) {
          res.json(results);
        } else {
          res.json([]);
        }
      }
    });
  });
  //get all membership plans 
  app.get('/allPackages', (req, res) => {
    db.query('SELECT * FROM gymManagement.membership_plan', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.error('results:', results);
        // Check if any results were returned
        if (results.length > 0) {
          res.json(results);
        } else {
          res.json([]);
        }
      }
    });
  });
  
  //get all feedback 
  
  app.get('/addfeedback', (req, res) => {
    db.query('SELECT * FROM gymManagement.feedback f JOIN gymManagement.member m on m.member_id = f.member_id', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.error('results:', results);
        // Check if any results were returned
        if (results.length > 0) {
          res.json(results);
        } else {
          res.json([]);
        }
      }
    });
  });
    //get all workouts
    app.get('/allworkouts', (req, res) => {
      db.query('SELECT * FROM gymManagement.workout_class_instance w JOIN gymManagement.trainer t on t.trainer_id = w.trainer_id JOIN gymManagement.workoutclass_uses_gymequipment wg on wg.workout_class_id = w.workout_class_id JOIN gymManagement.gym_equipment g ON g.equipment_id = wg.equipment_id;',(err, results) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Internal Server Error');
        } else {
          console.error('results:', results);
          // Check if any results were returned
          if (results.length > 0) {
            res.json(results);
          } else {
            res.json([]);
          }
        }
      });
    });
        //get all workouts
        app.get('/allworkoutsforTrainer', (req, res) => {
          const trainerId = req.query.trainerId;
          db.query('SELECT * FROM gymManagement.workout_class_instance w JOIN gymManagement.trainer t on t.trainer_id = w.trainer_id where t.trainer_id = ?', [trainerId], (err, results) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Internal Server Error');
            } else {
              console.error('results:', results);
              // Check if any results were returned
              if (results.length > 0) {
                res.json(results);
              } else {
                res.json([]);
              }
            }
          });
        });

        // single user data
        app.get('/getuser', (req, res) => {
          const userid = req.query.userid;
          db.query('SELECT * FROM gymManagement.member m JOIN gymManagement.membership_plan mp on mp.membership_plan_id = m.membership_plan_id WHERE member_id = ?', [userid], (err, results) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Internal Server Error');
            } else {
              res.json(results);
            }
          });
        });
    
        // get users attending class
        app.get('/getUsersAttendingClass', (req, res) => {
          const class_id = req.query.classId;
          db.query('SELECT m.* FROM attendance a JOIN member m on m.member_id = a.member_id JOIN workout_class_instance w on w.workout_class_instance_id = a.workout_class_instance_id JOIN trainer t on t.trainer_id = w.trainer_id WHERE w.workout_class_instance_id = ?', [class_id], (err, results) => {
            if (err) {
              console.error('Error executing query:', err);
              res.status(500).send('Internal Server Error');
            } else {
              res.json(results);
            }
          });
        });

// Route to add attendance
app.post('/addAttendance', (req, res) => {
  const { member_id, workout_class_instance_id, date } = req.body;

  const attendance = {
    member_id,
    workout_class_instance_id,
    date
  };
  db.query('SELECT m.* FROM attendance a JOIN member m on m.member_id = a.member_id JOIN workout_class_instance w on w.workout_class_instance_id = a.workout_class_instance_id JOIN trainer t on t.trainer_id = w.trainer_id WHERE w.workout_class_instance_id = ? and m.member_id = ?', [workout_class_instance_id,member_id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      if(results.length == 0){
       // Insert feedback into the 'Feedback' table
  db.query('INSERT INTO gymManagement.attendance SET ?', attendance, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json({ message: 'Attendance stored successfully', feedbackId: results.insertId });
    }
  });
}
    }
  });

 
});

// Procedures

const callProcedure = () => {
  db.query('CALL GetMembersWithBasicPlan()', (error, results) => {
    if (error) {
      console.error('Error calling stored procedure:', error);
    } else {
      console.log('Results:', results[0]); // Stored procedure results are in the first element of the results array
    }
  });
};

const callProcedureAddMember = (params, callback) => {
  const sql = `
  CALL AddMember(
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  )`;
  let userData = [
    params.username,
    params.password,
    params.fname,
    params.lname,
    params.age,
    params.gender,
    params.email,
    params.phone_no,
    params.address,
    params.membership_status,
    params.dateOfRegistration,
    params.membership_plan_id
  ]
  db.query(sql,userData, (error, results) => {
    if (error) {
      console.error('Error calling stored procedure:', error);
      callback(error, null);
    } else {
      console.log('Results:', results[0]); // Stored procedure results are in the first element of the results array
      callback(null, results);
    }
  });
};

const addTrainerProcedure =  (params, callback) => {
  const sql = `
    CALL AddTrainer(
      ?, ?, ?, ?, ?, ?, ?
    )`;

  db.query(
    sql,
    [
      params.username,
      params.password,
      params.fname,
      params.lname,
      params.phone_no,
      params.email,
      params.management_id
    ],
    (error, results) => {
      if (error) {
        console.error('Error calling AddTrainer stored procedure:', error);
        callback(error, null);
      } else {
        console.log('Trainer added successfully:', results);
        callback(null, results);
      }
    }
  );
};

// generateInvoice Procedure
const generateInvoiceProcedure = (params, callback) => {
  const sql = `
    CALL GenerateInvoice(?, ?, ?)`;

  db.query(
    sql,
    [
      params.member_id,
      params.date,
      params.amount
    ],
    (error, results) => {
      if (error) {
        console.error('Error calling GenerateInvoice stored procedure:', error);
        callback(error, null);
      } else {
        console.log('Invoice generated successfully:', results);
        callback(null, results);
      }
    }
  );
};

const addMembershipPlanProcedure = (params, callback) => {
  const sql = `
    CALL AddMembershipPlan(
      ?, ?, ?, ?, ?
    )`;

  db.query(
    sql,
    [
      params.plan_name,
      params.price,
      params.duration,
      params.benefits,
      params.management_id
    ],
    (error, results) => {
      if (error) {
        console.error('Error calling AddMembershipPlan stored procedure:', error);
        callback(error, null);
      } else {
        console.log('Membership plan added successfully:', results);
        callback(null, results);
      }
    }
  );
};

// Function to call the GetMemberTrainingDetails stored procedure
function callGetMemberTrainingDetails(memberId) {
  const procedureName = 'GetMemberTrainingDetails';

  // Define the SQL query for calling the stored procedure with a parameter
  const sqlQuery = `CALL ${procedureName}(${memberId})`;

  // Execute the SQL query
  db.query(sqlQuery, (error, results, fields) => {
    if (error) {
      console.error('Error calling stored procedure:', error);
    } else {
      console.log('Stored procedure executed successfully');
      console.log('GetMemberTrainingDetails Results:', results[0]); // Assuming the stored procedure returns a result set
    }
  });
}

//functions


const isMembershipExpiredFunction = (memberId) => {
  const sql = 'SELECT IsMembershipExpired(?) AS isExpired';

  db.query(sql, [memberId], (error, results) => {
    if (error) {
      console.error('Error calling IsMembershipExpired function:', error);
    } else {
      const isExpired = (results[0].isExpired == 1);
      console.error('Isexpired?', isExpired);
    }
  });
};

const needsMaintenanceFunction = (equipmentId) => {
  const sql = 'SELECT NeedsMaintenance(?) AS needsMaintenance';

  db.query(sql, [equipmentId], (error, results) => {
    if (error) {
      console.error('Error calling NeedsMaintenance function:', error);
    } else {
      const needsMaintenance = (results[0].needsMaintenance == 0);
      console.log("Needs maintainenance? ",needsMaintenance)
    }
  });
};


const getMemberMembershipPlanFunction = (memberId) => {
  const sql = 'SELECT GetMemberMembershipPlan(?) AS membershipPlanDetails';

  db.query(sql, [memberId], (error, results) => {
    if (error) {
      console.error('Error calling GetMemberMembershipPlan function:', error);
    } else {
      const membershipPlanDetails = results[0].membershipPlanDetails;
      console.log("Membership details ",membershipPlanDetails)
    }
  });
};


const getMemberLastWorkoutClassInstanceFunction = (memberId) => {
  const sql = 'SELECT GetMemberLastWorkoutClassInstance(?) AS workoutClassDetails';

  db.query(sql, [memberId], (error, results) => {
    if (error) {
      console.error('Error calling GetMemberLastWorkoutClassInstance function:', error);
    } else {
      const workoutClassDetails = results[0].workoutClassDetails;
      console.log("Workout class details ",workoutClassDetails)
    }
  });
};


app.listen(PORT, () => {
  console.log("Server is running on port ${PORT}");
  // callProcedure();
  callGetMemberTrainingDetails(3)
  //function calls
  isMembershipExpiredFunction(3);
  needsMaintenanceFunction(2)
  getMemberMembershipPlanFunction(3);
  getMemberLastWorkoutClassInstanceFunction(3);
});
