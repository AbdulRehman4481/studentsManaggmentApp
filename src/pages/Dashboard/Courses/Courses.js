import { Button, Col, Form, Input, Modal, Pagination, Row, Space, Tooltip, message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import { collection, deleteDoc, doc, getDocs, query, setDoc } from 'firebase/firestore'
import { firestore } from 'config/firebase'
import { BiLogoDiscourse } from 'react-icons/bi';

const initialValue = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  rollNo: "",
  coures: "",

}

export default function Coures() {
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
    const {
      courseName,
      courseCode,
      coursesDuration,
      description,

    } = state
    if (!courseName) { return message.error("Please enter First Name") }
    if (!courseCode) { return message.error("Please enter phone") }
    if (!coursesDuration) { return message.error("Please enter email") }
    if (!description) { return message.error("Please enter coures") }

    const curseData = {
      courseName,
      courseCode,
      coursesDuration,
      description,
      dateCreated: new Date().getTime(),
      id: Math.random().toString(36).slice(2),

    }
    creatDocument(curseData);
  };
  // In This Case we Add Todo in FireBase
  const creatDocument = async (curseData) => {
    try {
      await setDoc(doc(firestore, "curseData", curseData.id), curseData);
      message.success("Add curse Successfully.");
    } catch (error) {
      message.error("Something Went Wrong While Adding curse");
      console.error("Error", error);
    }
    setOpenModal(false);
  };


  let getCourses = async () => {
    const q = query(collection(firestore, "curseData"));
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


  const handleDelete = async (curseData) => {

    try {
      await deleteDoc(doc(firestore, "curseData", curseData.id));

      let documentsAfterDelete = documents.filter(doc => doc.id !== curseData.id)
      setAllDocuments(documentsAfterDelete)
      setDocuments(documentsAfterDelete)

      message.success("curse deleted successfully")
    } catch (err) {
      console.error(err)
      message.error("something went wrong while  curse")
    }
  }

  const handleEditOpen = (curseData) => {
    setState({ ...curseData });
    setOpenModal2(true);
  };
  const handleUpdate = async (curseData) => {
    const updatedcurseData = {
      ...curseData,

    };

    try {
      await setDoc(doc(firestore, "curseData", updatedcurseData.id), updatedcurseData);
      message.success("Course Updated Successfully.");

      const updatedDocuments = documents.map((doc) =>
        doc.id === updatedcurseData.id ? updatedcurseData : doc
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
    getCourses()
  }, [getCourses])


  return (
    <>
      <div className="container text-white">
        <div className="row">
          <div className="col">
            <h1 className='py-2'>
              <i><BiLogoDiscourse className='mx-2 pb-2' size={60} color='white' /></i>
              Courses
            </h1>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="table-responsive p-3" >
              <div style={{ display: "flex", justifyContent: "space-between" }}>

                <h3>
                  Courses List
                </h3>
                <div>
                  <Space>

                    <Button onClick={() => { setOpenModal(true) }}>Add Courses</Button>

                  </Space>
                </div>
              </div>
              <div style={{ height: '450px', overflow: 'auto' }}>
                <table  >
                  <thead className="table-header" >
                    <tr>
                      <th>Course Name </th>
                      <th>Course Code</th>
                      <th>Courses Duration</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody  >
                    {documents.length === 0 ? (
                      <tr>
                        <td colSpan={4}><h1 className='text-center'>No Courses</h1></td>
                      </tr>
                    ) : (
                      documents.map((curseData, i) => (
                        <tr key={i}  >
                          <td>{curseData.courseName}</td>
                          <td>{curseData.courseCode}</td>
                          <td>{curseData.coursesDuration}</td>
                          <td>{curseData.description}</td>

                          <td>
                            <Space>
                              <Tooltip title="Delete" color='red'>
                                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(curseData)} />
                              </Tooltip>
                              <Tooltip title="Edit" color='primary'>
                                <Button type="primary" icon={<EditOutlined />} onClick={() => { handleEditOpen(curseData) }} />
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
              <Form.Item label="Course Name">
                <Input placeholder=' Course Name' name='courseName' onChange={handleChange} />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item label="Course Code">
                <Input placeholder=' Course Code' name='courseCode' onChange={handleChange} />
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Form.Item label="Courses Duration ">
                <Input placeholder=' Courses Duration' name='coursesDuration' onChange={handleChange} />

              </Form.Item>

            </Col>

            <Col xs={24} lg={12}>
              <Form.Item label="Description">
                <Input placeholder=' Description' name='description' onChange={handleChange} />

              </Form.Item>

            </Col>
          </Row>
        </Form>
      </Modal >
      <Modal
        title="Update Curse"
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
                <Input name='courseName' value={state.courseName} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Last Name">
                <Input name='courseCode' value={state.courseCode} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Phone No">
                <Input name='coursesDuration' value={state.coursesDuration} onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col xs={24} lg={8}>
              <Form.Item label="Email">
                <Input name='description' value={state.description} onChange={handleChange} />
              </Form.Item>
            </Col>

          </Row>
        </Form>
      </Modal >

    </>
  )
}

