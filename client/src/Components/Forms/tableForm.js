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

const DynamicForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FieldContainer = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const TableForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tableName } = location.state;
  const [columns, setColumns] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/gettable/${tableName}`);
        const fetchedColumns = response.data.filter(column => column.column_name !== 'id' && column.column_name !== 'created_at').map(column => ({
          name: column.column_name,
          type: column.data_type,
        }));
        setColumns(fetchedColumns);
        setFormData({});
      } catch (error) {
        console.error('Error fetching table columns:', error);
      }
    };
  
    fetchColumns();
  }, [tableName]);

  const handleInputChange = (column, value) => {
    setFormData({
      ...formData,
      [column]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/addrow/${tableName}`, formData);
      console.log('Data submitted successfully:', response.data);
      if (response.status === 201) {
        navigate('/table-data', { state: { tableName } });
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <Container>
      <Title>Insert Data into {tableName}</Title>
      {columns.length > 0 ? (
        <DynamicForm onSubmit={handleSubmit}>
          {columns.map((column, index) => (
            <FieldContainer key={index}>
              <Label>{column.name}</Label>
              <Input
                type="text"
                value={formData[column.name] || ''}
                onChange={(e) => handleInputChange(column.name, e.target.value)}
              />
            </FieldContainer>
          ))}
          <Button type="submit">Submit</Button>
        </DynamicForm>
      ) : (
        <p>Loading columns...</p>
      )}
    </Container>
  );
};

export default TableForm;
