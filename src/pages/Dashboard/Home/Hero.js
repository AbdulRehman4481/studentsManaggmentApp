import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { PiStudentFill } from 'react-icons/pi';
import { BiLogoDiscourse } from 'react-icons/bi';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from 'config/firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Hero() {
  const [studentsNumber, setStudentsNumber] = useState(0);
  const [courseNumber, setCourseNumber] = useState(0);

  const getStudentsNumber = async () => {
    const q = query(collection(firestore, 'students'));
    try {
      const querySnapshot = await getDocs(q);
      const numberOfStudents = querySnapshot.size;
      return numberOfStudents;
    } catch (error) {
      console.error('Error fetching students number:', error);
      return 0;
    }
  };

  const getCourseNumber = async () => {
    const q = query(collection(firestore, 'curseData')); // Assuming 'curseData' is the correct collection name
    try {
      const querySnapshot = await getDocs(q);
      const numberOfCourses = querySnapshot.size;
      return numberOfCourses;
    } catch (error) {
      console.error('Error fetching curseData number:', error);
      return 0;
    }
  };

  useEffect(() => {
    getStudentsNumber().then((number) => {
      setStudentsNumber(number);
    });
    getCourseNumber().then((number) => {
      setCourseNumber(number);
    });
  }, []);

  const areaChartData = [
    { name: 'Students', value: studentsNumber },
    { name: 'Courses', value: courseNumber },
  ];

  return (
    <>
   
      <div className="container">
        <div className="row">
          <div className="col">
            <Row>
              <Col span={6} id="dashboardBoxes">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="fs-5">{studentsNumber}</span>
                  <span className="fs-5">Students</span>
                </div>
                <i>
                  <PiStudentFill size={80} />
                </i>
              </Col>
              <Col span={6} id="dashboardBoxes">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="fs-5">{courseNumber}</span>
                  <span className="fs-5">Courses</span>
                </div>
                <i>
                  <BiLogoDiscourse size={80} />
                </i>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="container  pt-5">
        <div className="row">
          <div className="col">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={areaChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="value" fill="#016CEE" stroke="#016CEE" name="Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
