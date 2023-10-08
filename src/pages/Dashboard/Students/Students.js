import { Button, Col, Form, Input, Modal, Row, Space, Tooltip, message } from 'antd'
import React, {  useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { collection, deleteDoc, doc, getDocs, query, setDoc } from 'firebase/firestore'
import { firestore } from 'config/firebase'
import { PiStudentFill } from 'react-icons/pi';

const initialValue = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  rollNo: "",
  coures: "",
  status: ""

}

export default function Students() {
  // const { documents, getStudents, handleDelete, } = useContext(StudentsContext)
  const [openModal, setOpenModal] = useState(false)
  const [state, setState] = useState(initialValue)
  const [openModal2, setOpenModal2] = useState(false)
  const [documents, setDocuments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleDate = (_, date) => setState(s => ({ ...s, date }))

  const handleSubmit = (e) => {

    e.preventDefault();
    const { firstName,
      lastName,
      phone,
      email,
      rollNo,
      coures,
      status
    } = state
    if (!firstName) { return message.error("Please enter First Name") }
    if (!phone) { return message.error("Please enter phone") }
    if (!email) { return message.error("Please enter email") }
    if (!coures) { return message.error("Please enter coures") }

    const students = {
      firstName, lastName, phone, email, rollNo, coures,status,
      dateCreated: new Date().getTime(),
      id: Math.random().toString(36).slice(2),
    }
    creatDocument(students);
  };
  // In This Case we Add Todo in FireBase
  const creatDocument = async (students) => {
    try {
      await setDoc(doc(firestore, "students", students.id), students);
      message.success("Add students Successfully.");
    } catch (error) {
      message.error("Something Went Wrong While Adding students");
      console.error("Error", error);
    }
    setOpenModal(false);
  };


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


  const handleDelete = async (students) => {

    try {
      await deleteDoc(doc(firestore, "students", students.id));

      let documentsAfterDelete = documents.filter(doc => doc.id !== students.id)
      setAllDocuments(documentsAfterDelete)
      setDocuments(documentsAfterDelete)

      message.success("students deleted successfully")
    } catch (err) {
      console.error(err)
      message.error("something went wrong while  students")
    }
  }

  const handleEditOpen = (students) => {
    setState({ ...students });
    setOpenModal2(true);
  };

  const handleUpdate = async (students) => {
    const updatedStudents = {
      ...students,

    };

    try {
      await setDoc(doc(firestore, "students", updatedStudents.id), updatedStudents);
      message.success("students Updated Successfully.");

      const updatedDocuments = documents.map((doc) =>
        doc.id === updatedStudents.id ? updatedStudents : doc
      );
      setDocuments(updatedDocuments);
      setAllDocuments(updatedDocuments);
    } catch (error) {
      message.error("Something Went Wrong While Updating students");
      console.error("Error", error);
    }
    setOpenModal2(false)
  };

  useEffect(() => {
    getStudents()
  }, [getStudents])


  return (
    <>
      <div className="container text-white">
        <div className="row">
          <div className="col">
            <h1 className='py-2'>
              <i><PiStudentFill className='mx-2 pb-2' size={60} color='white' /></i>   Students
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
                <div>
                  <Space>

                    <Button onClick={() => { setOpenModal(true) }}>Add Student</Button>
                    <Button >Attendance</Button>
                  </Space>
                </div>
              </div>
              <div style={{ height: "450px", overflow: "auto" }}>

                <table >
                  <thead className="table-header" >
                    <tr>
                      <th>Student Name </th>
                      <th>Course</th>
                      <th>Roll No:</th>
                      <th>Email</th>
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

                          <td>
                            <Space>
                              <Tooltip title="Delete" color='red'>
                                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(students)} />
                              </Tooltip>
                              <Tooltip title="Edit" color='primary'>
                                <Button type="primary" icon={<EditOutlined />} onClick={() => { handleEditOpen(students) }} />
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
      <Modal
        title="Add Student Detail"
        style={{
          top: 20,
        }}
        open={openModal}
        onOk={handleSubmit}
        onCancel={() => setOpenModal(false)}
      >
        <Form layout="vertical" className='py-4'>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Form.Item label="First Name">
                <Input placeholder=' First Name' name='firstName' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item label="Last Name">
                <Input placeholder=' Last Name (Optional)' name='lastName' onChange={handleChange} />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item label="Phon No">
                <Input placeholder=' Phone No' name='phone' onChange={handleChange} />

              </Form.Item>

            </Col>

            <Col xs={24} lg={12}>
              <Form.Item label="Email">
                <Input placeholder=' Email' name='email' onChange={handleChange} />

              </Form.Item>

            </Col>


            <Col xs={24} lg={12}>
              <Form.Item label="Give Him a Roll No">
                <Input placeholder=' Roll No' name='rollNo' onChange={handleChange} />

              </Form.Item>

            </Col>

            <Col xs={24} lg={24}>
              <Form.Item label="Courses">
                <Input placeholder=' Course' name='coures' onChange={handleChange} />

              </Form.Item>

            </Col>
          </Row>
        </Form>
      </Modal >
      <Modal
        title="Update Student"
        style={{
          top: 20,
        }}
        open={openModal2}
        onOk={() => { handleUpdate(state) }}
        onCancel={() => setOpenModal2(false)}
      >
        <Form layout="vertical" className='py-4'>
          <Row gutter={16}>
            <Col xs={24} lg={8}>
              <Form.Item label="First Name">
                <Input placeholder='Input your title' name='firstName' value={state.firstName} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Last Name">
                <Input placeholder='Input your title' name='lastName' value={state.lastName} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Phone No">
                <Input placeholder='Input your title' name='phone' value={state.phone} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Email">
                <Input placeholder='Input your title' name='email' value={state.email} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Roll No">
                <Input placeholder='Input your title' name='rollNo' value={state.rollNo} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Coures">
                <Input placeholder='Input your title' name='coures' value={state.coures} onChange={handleChange} />
              </Form.Item>
            </Col>




          </Row>
        </Form>
      </Modal >

    </>
  )
}

