import { Button,  Space, Tooltip  } from 'antd'
import React, {  useEffect, useState } from 'react'

import { collection,  doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore'
import { firestore } from 'config/firebase'
import { PiStudentFill } from 'react-icons/pi';


export default function Attandence() {
  const [documents, setDocuments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);

  const [Status, setStatus] = useState([]);

  const studentStatusCollection = collection(firestore, 'studentStatus');



  let getStudents = async () => {
    const q = query(collection(firestore, "students"));
    try {
      const querySnapshot = await getDocs(q);
      const array = [];

      querySnapshot.forEach((doc) => {
        let data = doc.data();
        array.push(data);

      });
      setDocuments(array);
      setAllDocuments(array);
    }
    catch (error) {
      console.error("Error fetching data:", error);
    }

  };
  useEffect(() => {
    const getStatusData = async (students) => {
      try {
        const statusDoc = await getDoc(doc(firestore, 'studentStatus', 'statusData')); // Replace 'statusData' with your desired document ID
        if (statusDoc.exists()) {
          setStatus(statusDoc.data().status || []);
        } else {
          // Initialize Status array with default values if the document doesn't exist
          const initialStatus = Array(students.length).fill('');
          setStatus(initialStatus);
        }
      } catch (error) {
        console.error('Error getting status data from Firestore:', error);
      }
    };

    getStatusData();
  }, [ ]);

  const handleStatusChange = async (index, newStatus) => {
    const updatedStatusArray = [...Status];
    updatedStatusArray[index] = newStatus;
    setStatus(updatedStatusArray);

    try {
      // Update status in Firestore
      await setDoc(doc(firestore, 'studentStatus', 'statusData'), {
        status: updatedStatusArray,
      });
      console.log('Status updated in Firestore.');
    } catch (error) {
      console.error('Error updating status data in Firestore:', error);
    }
  };

  useEffect(() => {
    getStudents()
  }, [getStudents])

  return (
    <>
      <div className="container text-white">
        <div className="row">
          <div className="col">
            <h1 className='py-2 '>
              <i><PiStudentFill className='mx-2 pb-2' size={60} color='white' /></i>   Attendance
            </h1>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="table-responsive" >
              <div style={{ display: "flex", justifyContent: "space-between" }}>

                <h3>
                  Students List
                </h3>

              </div>
              <div style={{ overflow: "auto", height: "450px" }}>


                <table >
                  <thead className="table-header" >
                    <tr>
                      <th>Student Name </th>
                      <th>Course</th>
                      <th>Roll No:</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody  >
                    {documents.length === 0 ? (
                      <tr>
                        <td colSpan={4}><h1 className='text-center'>No Students</h1></td>
                      </tr>
                    ) : (
                      documents.map((students, i) => (
                        <tr key={i}  >
                          <td>{students.firstName}</td>
                          <td>{students.coures}</td>
                          <td>{students.rollNo}</td>
                          <td>{students.email}</td>
                          <td>{Status[i]}</td>

                          <td>
                            <Space>
                              <Tooltip color='red' title="Absent">
                                <Button
                                  danger
                                  onClick={() => handleStatusChange(i, 'Absent')} // Handle Absent button click
                                  disabled={Status[i] === 'Absent'} // Disable the button if status is already Absent
                                >
                                  Absent
                                </Button>
                              </Tooltip>
                              <Tooltip color='primary' title="Present" >
                                <Button
                                  onClick={() => handleStatusChange(i, 'Present')} // Handle Absent button click
                                  disabled={Status[i] === 'Present'}
                                >
                                  Present
                                </Button>
                              </Tooltip>
                            </Space>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}
