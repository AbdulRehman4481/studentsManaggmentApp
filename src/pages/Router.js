import React from 'react'
import {  Route, Routes } from 'react-router-dom'

import Dashboard from './Dashboard'

export default function Index() {
  return (
    <>
      <Routes>
        <Route path='/*' element={<Dashboard />} />
      </Routes>
    </>
  )
}
