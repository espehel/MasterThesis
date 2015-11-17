package database;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import static java.sql.DriverManager.getConnection;


public class DBConnection {
    private Connection connection;

    private static DBConnection dbConnection;

    private DBConnection() {
        try {
            //register driver
            Class.forName("com.mysql.jdbc.Driver");
            //connect
            connection = getConnection("jdbc:mysql://localhost/wikipedia","root","");
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }

    public static Statement createStatement() throws SQLException {
        if(dbConnection == null) {
            dbConnection = new DBConnection();
        }
        return dbConnection.connection.createStatement();
    }

    public static void close() {
        try {
            dbConnection.connection.close();
            dbConnection.connection = null;
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
