# MySQL Database Setup Guide

## Quick Setup

### 1. Install MySQL

If you don't have MySQL installed:
- **Windows**: Download from [MySQL Official Site](https://dev.mysql.com/downloads/mysql/)
- **Mac**: `brew install mysql`
- **Linux**: `sudo apt-get install mysql-server`

### 2. Start MySQL Service

**Windows:**
```bash
# Start MySQL service
net start MySQL
```

**Mac/Linux:**
```bash
sudo systemctl start mysql
# or
sudo service mysql start
```

### 3. Create Database

Open MySQL command line or MySQL Workbench:

```sql
CREATE DATABASE quizgen_db;
```

Or via command line:
```bash
mysql -u root -p -e "CREATE DATABASE quizgen_db;"
```

### 4. Configure Backend

1. Navigate to server folder:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=quizgen_db
DB_PORT=3306
```

### 5. Start Backend Server

```bash
npm run dev
```

The server will automatically:
- ✅ Connect to MySQL
- ✅ Create all necessary tables
- ✅ Start API server on port 5000

## Database Tables

The following tables will be created automatically:

1. **users** - User accounts
2. **tests** - Test records
3. **test_questions** - Questions for each test
4. **test_results** - Detailed results for each question

## Testing Connection

You can test if everything works:

1. Start the backend server
2. Visit: `http://localhost:5000/api/health`
3. Should see: `{"status":"OK","message":"QuizGen API is running"}`

## Troubleshooting

### Connection Refused
- Make sure MySQL is running
- Check if port 3306 is correct
- Verify username and password

### Database Not Found
- Create the database manually: `CREATE DATABASE quizgen_db;`

### Permission Denied
- Make sure MySQL user has proper permissions
- Try: `GRANT ALL PRIVILEGES ON quizgen_db.* TO 'root'@'localhost';`


