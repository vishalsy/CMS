import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TableList from './Components/tableList';
import TableForm from './Components/Forms/tableForm';
import DynamicTableForm from './Components/Forms/tableCreationForm'
import TableData from './Components/tableData';
import TableRowUpdateForm from './Components/Forms/tableRowUpdateForm';

import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #05203c;
  padding: 10px 20px;
`;

const NavList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;  

const NavItem = styled.li`
  display: inline;
  margin-right: 20px;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    color: #ddd;
  }
`;

const App = () => {
  return (
    <Router>
      <div>
        <Nav>
          <NavList>
            <NavItem>
              <NavLink to="/create-table">Create Table</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/">View Tables</NavLink>
            </NavItem>
          </NavList>
        </Nav>
        <Routes>
          <Route path="/create-table" element={<DynamicTableForm />} />
          <Route path="/" element={<TableList />} />
          <Route path="/table-form" element={<TableForm />} />
          <Route path="/table-data" element={<TableData />} />
          <Route path="/update-data" element={<TableRowUpdateForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
