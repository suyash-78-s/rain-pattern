import React, { useState, useEffect } from 'react';
import Square from './Square';
import './Grid.css';

const Grid = () => {
  const [grid, setGrid] = useState([]);
  const [drops, setDrops] = useState([]);
  const rows = 30;
  const columns = 50;
  const baseColor = [0, 0, 255]; // Blue color in RGB

  useEffect(() => {
    const initializeGrid = () => {
      const newGrid = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => ({
          color: '',
        }))
      );
      setGrid(newGrid);
    };
    initializeGrid();
  }, [rows, columns]);

  useEffect(() => {
    const createDrops = () => {
      const newDrops = Array.from({ length: columns }, () => ({
        position: Math.floor(Math.random() * rows),
        length: Math.floor(Math.random() * 3) + 3, // Length between 3 and 5
      }));
      setDrops(newDrops);
    };
    createDrops();
  }, [rows, columns]);

  const generateColor = (baseColor, intensity) => {
    const [r, g, b] = baseColor;
    const factor = 1 - intensity * 0.2;
    return `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops(prevDrops =>
        prevDrops.map(drop => ({
          position: (drop.position + 1) % rows,
          length: drop.length,
        }))
      );

      setGrid(prevGrid => {
        const newGrid = prevGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const drop = drops[colIndex];
            let color = '';
            if (rowIndex >= drop.position && rowIndex < drop.position + drop.length) {
              color = generateColor(baseColor, rowIndex - drop.position);
            }
            return { color };
          })
        );
        return newGrid;
      });
    }, 1000 / 30); // 30 frames per second

    return () => clearInterval(interval);
  }, [rows, columns, drops]);

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Square key={colIndex} color={cell.color} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
