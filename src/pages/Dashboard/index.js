import React from 'react'
import Home from './Home'
import { Divider, Layout, Menu } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { AiFillDashboard } from 'react-icons/ai';
import { PiStudentFill } from 'react-icons/pi';
import { BiLogoDiscourse } from 'react-icons/bi';
import { VscGraph } from 'react-icons/vsc';
import Students from './Students';
import Courses from './Courses';
import Attandence from './Graphs';

export default function Index() {
    const navigate = useNavigate()

    return (
        <>
            <div className="fluid-container" id='mainContainer'>
                <Layout id='mainLayout' style={{ height: "100vh", backgroundColor: "transparent" }}>
                    <Sider
                        id='mainSider'
                        breakpoint="lg"
                        collapsedWidth="70px"
                        style={{ backgroundColor: "transparent" }}
                    >
                        <div className="demo-logo-vertical" />
                        <Menu
                            onClick={({ key }) => {
                                if (key === "signout") {
                                    ///////
                                } else {
                                    navigate(key)
                                }
                            }}
                            style={{ backgroundColor: "transparent" }}
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            items={[

                                {
                                    label: "Menu",
                                    className: "fs-3 ",
                                },
                                <Divider type='light' />,
                                {
                                    label: "Dashboard",
                                    key: "/",
                                    className: "fs-5 mb-3",
                                    icon: <i><AiFillDashboard size={20} color='white' /></i>
                                },
                                {
                                    label: "Students",
                                    key: "/students",
                                    className: "fs-5 mb-3",
                                    icon: <i><PiStudentFill size={20} color='white' /></i>
                                },
                                {
                                    key: "/courses",
                                    label: "Courses",
                                    className: "fs-5 mb-3",
                                    icon: <i><BiLogoDiscourse size={20} color='white' /></i>
                                },
                                {
                                    key: "/attendance",
                                    label: "Attendance",
                                    className: "fs-5 mb-3",
                                    icon: <i><VscGraph size={20} color='white' /></i>
                                },



                            ]}

                        />
                    </Sider>
                    <Layout style={{backgroundColor:"transparent"}}
                    >
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                minHeight: 280,
                                backgroundColor: "transparent",
                                overflow: "hidden"
                            }}
                        >
                            <Routes>
                                <Route path='/' element={<Home />} />
                                <Route path='/students' element={<Students />} />
                                <Route path='/courses' element={<Courses />} />
                                <Route path='/attendance' element={<Attandence />} />
                            </Routes>
                        </Content>
                    </Layout>
                </Layout>

            </div >
        </>
    )
}
