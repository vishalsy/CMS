import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const TableContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #e9e9e9;

`;

const TableTitle = styled.h2`
margin-bottom: 20px;
`;


const Button = styled.button`
  margin-right: 10px;
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CreateButton = styled(Button)`
  background-color: #FFFFFF;
  color: #000000
  ;

  &:hover {
    background-color:#FFFFFF;
  }
`;

const ViewButton = styled(Button)`
  background-color: #05203c;
  color: #fff;

  &:hover {
    background-color:#05203c;
  }
`;

const TableList = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:3000/gettable'); 
        setTables(response.data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

  const handleTableClick = (tableName) => {
    navigate('/table-form', { state: { tableName } });
  };

  const handleViewAllDataClick = (tableName) => {
    navigate('/table-data', { state: { tableName } });
  };

  return (
    <Container>
      <Title>All Relations</Title>
      {tables.length > 0 ? (
        tables.map((table, index) => (
          <TableContainer key={index}>
            <TableTitle>{table}</TableTitle>
            <div>
              <CreateButton onClick={() => handleTableClick(table)}>Create New Row</CreateButton>
              <ViewButton onClick={() => handleViewAllDataClick(table)}>View All Data</ViewButton>
            </div>
          </TableContainer>
        ))
      ) : (
        <p>No tables found.</p>
      )}
    </Container>
  );
};

export default TableList;
