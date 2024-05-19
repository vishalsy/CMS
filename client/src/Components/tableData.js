import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #05203c;
  color: #fff;
  text-align: left;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #FFFFFF;
  }
`;

const TableCell = styled.td`
  padding: 10px;
`;

const Button = styled.button`
  margin-right: 5px;
  padding: 5px 10px;
  font-size: 14px;
  background-color: #05203c;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const UpdateButton = styled(Button)`
  background-color: #05203c;
  color: #fff;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #d9534f;
  color: #fff;

  &:hover {
    background-color: #c9302c;
  }
`;

const TableData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tableName } = location.state;
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/gettabledata/${tableName}`);
        if (response.data.length > 0) {
          const headers = Object.keys(response.data[0]);
          setTableHeaders(headers);
        }
        setTableData(response.data);
      } catch (error) {
        console.error('Error fetching table data:', error);
      }
    };

    if(tableData.length === 0){
        fetchTableData();
    }
    
  }, [tableName, tableData]);

  const handleDeleteRow = async (rowId) => {
    try {
      await axios.delete(`http://localhost:3000/deleterow/${tableName}/${rowId}`);
      setTableData(prevData => prevData.filter(row => row.id !== rowId));
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };
  

  const handleUpdateRow = async (rowData) => {
    navigate('/update-data', { state: { tableName, rowData } });
  };

  return (
    <Container>
      <Title> Relation - {tableName}</Title>
      <Table>
        <thead>
          <tr>
            {tableHeaders.map((header, index) => (
              <TableHeader key={index}>{header}</TableHeader>
            ))}
            <TableHeader>Action</TableHeader>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {tableHeaders.map((header, cellIndex) => (
                <TableCell key={cellIndex}>{row[header]}</TableCell>
              ))}
              <TableCell>
              <UpdateButton onClick={() => handleUpdateRow(row)}>Update</UpdateButton>
                <DeleteButton onClick={() => handleDeleteRow(row.id)}>Delete</DeleteButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TableData;
