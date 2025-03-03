import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext.js';
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../redux/auth/authSlice';

const columns = [
  { name: "ID", selector: (row) => row._id, sortable: true },
  { name: "Name", selector: (row) => row.name, sortable: true },
  { name: "Email", selector: (row) => row.email },
  { name: "Role", selector: (row) => row.role },
];

const TotalClubs = () => {
  const dispatch = useDispatch();
  const { usersLoading, usersError } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [allData, setAllData] = useState([]);
  const [totalClubs, setTotalClubs] = useState(0);

  const themeClasses = useMemo(() => ({
    container: theme === 'dark' ? 'dark:border-gray-800 dark:bg-white/[0.03]' : '',
    text: theme === 'dark' ? 'dark:text-white/90' : 'text-gray-800',
    input: theme === 'dark' ? 'dark:bg-gray-800 dark:text-white/90' : '',
    placeholder: theme === 'dark' ? 'placeholder-gray-400' : 'placeholder-gray-500',
  }), [theme]);

  const filteredData = useMemo(() => {
    if (!search) return allData;
    return allData.filter((row) =>
      Object.values(row).some(value => 
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, allData]);

  const fetchData = useCallback(async () => {
    try {
      const result = await dispatch(fetchAllUsers());
      if (result.payload?.users?.clubs) {
        const clubs = result.payload.users.clubs;
        setAllData(clubs);
        setTotalClubs(clubs.length);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error:', error);
      setAllData([]);
      setTotalClubs(0);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const tableCustomStyles = useMemo(() => ({
    table: {
      style: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
      },
    },
    rows: {
      style: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#1a1a1a',
      },
    },
    headCells: {
      style: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#1a1a1a',
      },
    },
    pagination: {
      style: {
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#1a1a1a',
      },
    },
    paginationButton: {
      style: {
        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.9)' : '#1a1a1a',
      },
    },
  }), [theme]);

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 md:p-6 ${themeClasses.container}`}>
      <div className="mb-4">
        <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Total Clubs: {totalClubs}</h3>
      </div>
      <input
        type="text"
        placeholder="Search clubs..."
        value={search}
        onChange={handleSearch}
        className={`mb-4 p-2 border rounded w-full ${themeClasses.input} ${themeClasses.placeholder}`}
      />
      {usersLoading ? (
        <p className={themeClasses.text}>Loading...</p>
      ) : usersError ? (
        <p className="text-red-500">Error: {usersError}</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          theme={theme === 'dark' ? 'dark' : 'default'}
          customStyles={tableCustomStyles}
        />
      )}
    </div>
  );
}

export default TotalClubs;