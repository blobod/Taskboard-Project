package com.taskboard.e2e;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class UserManagementE2ETest {

    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeEach
    void setUp() {
        WebDriverManager.chromedriver().setup();

        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get("http://localhost:4200");
    }

    @Test
    void userCanRegisterAndLogin() {
        // Navigate to registration (click "Register here" link)
        WebElement registerLink = wait.until(
                ExpectedConditions.elementToBeClickable(By.linkText("Register here"))
        );
        registerLink.click();

        // Wait for register page to load
        wait.until(ExpectedConditions.urlContains("/register"));

        // Fill registration form using name attributes
        driver.findElement(By.name("name")).sendKeys("Test User");
        driver.findElement(By.name("email")).sendKeys("testuser@example.com");
        driver.findElement(By.name("password")).sendKeys("password123");
        driver.findElement(By.name("confirmPassword")).sendKeys("password123");

        // Click submit button (find by text "Create Account")
        WebElement createAccountBtn = driver.findElement(
                By.xpath("//button[contains(., 'Create Account')]")
        );
        createAccountBtn.click();

        // Wait for redirect to login page
        wait.until(ExpectedConditions.urlContains("/login"));

        // Login with new credentials
        driver.findElement(By.name("email")).sendKeys("testuser@example.com");
        driver.findElement(By.name("password")).sendKeys("password123");

        // Click login button
        WebElement loginBtn = driver.findElement(
                By.xpath("//button[contains(., 'Login')]")
        );
        loginBtn.click();

        // Verify successful login - check for redirect to /home
        wait.until(ExpectedConditions.urlContains("/home"));
        assertTrue(driver.getCurrentUrl().contains("/home"));
    }

    @Test
    @Disabled("Requires pre-existing test user in database")
    void userCanLogin() {

        driver.findElement(By.name("email")).sendKeys("testuser@example.com");
        driver.findElement(By.name("password")).sendKeys("password123");

        WebElement loginBtn = driver.findElement(
                By.xpath("//button[contains(., 'Login')]")
        );
        loginBtn.click();

        // Verify successful login
        wait.until(ExpectedConditions.urlContains("/home"));
        assertTrue(driver.getCurrentUrl().contains("/home"));
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}