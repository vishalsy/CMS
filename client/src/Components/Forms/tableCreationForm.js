import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #05203c;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #05203c;
  }

  &:not(:last-child) {
    margin-right: 10px;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
`;

const ColumnInput = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ColumnButton = styled(Button)`
  background-color: #dc3545;
  margin: 5px;

  &:hover {
    background-color: #c82333;
  }
`;

const DynamicTableForm = () => {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: '' }]);
  const navigate = useNavigate();


  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleColumnChange = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', type: '' }]);
  };

  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      tableName,
      columns
    };
    try {
      const response = await axios.post('http://localhost:3000/createtable', data);
      console.log(response.data);
      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  return (
    <Container>
      <Title>Create Table</Title>
      <Form onSubmit={handleSubmit}>
        <Label>Table Name</Label>
        <Input
          type="text"
          value={tableName}
          onChange={handleTableNameChange}
          required
        />
        <Label>Columns</Label>
        {columns.map((column, index) => (
          <ColumnContainer key={index}>
            <ColumnInput
              type="text"
              placeholder="Column Name"
              value={column.name}
              onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
              required
            />
            <ColumnInput
              type="text"
              placeholder="Column Type"
              value={column.type}
              onChange={(e) => handleColumnChange(index, 'type', e.target.value)}
              required
            />
            <ColumnButton type="button" onClick={() => removeColumn(index)}>
              Remove
            </ColumnButton>
          </ColumnContainer>
        ))}
        <Button type="button" onClick={addColumn}>
          Add Column
        </Button>
        <Button type="submit">Create Table</Button>
      </Form>
    </Container>
  );
};

export default DynamicTableForm;
