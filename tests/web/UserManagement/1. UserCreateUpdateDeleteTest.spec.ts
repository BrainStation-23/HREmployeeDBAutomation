import { expect, test } from "../../../lib/base.fixture";
import ENV from '../../../utils/env';
import fs from 'fs';
import path from 'path';
import LoginPage from '../../../pages/login.page'; import userCreateTestData from '../../../test_data/UserManagementTestData/createTestUserData.json'; // Test data import

test.describe("User Management - User Create, Update, Delete Test", () => {
    const loginEmail = ENV.TEST_SUPER_ADMIN_EMAIL as string;
    const loginPassword = ENV.TEST_SUPER_ADMIN_PASSWORD as string;

    // Prepare and apply Playwright authentication storage for all tests in this describe
    const authDir = path.resolve('playwright/.auth');
    const envName = (ENV.ENVIRONMENT_NAME || 'default').toLowerCase();
    const storageStatePath = path.join(authDir, `superAdmin.${envName}.json`);

    //#region Login Authentication Storage Setup
    test.use({ storageState: storageStatePath });

    test.beforeAll(async ({ browser }) => {
        if (!fs.existsSync(authDir)) {
            fs.mkdirSync(authDir, { recursive: true });
        }
        if (fs.existsSync(storageStatePath)) return;

        const context = await browser.newContext({ storageState: undefined });
        const page = await context.newPage();
        const login = new LoginPage(page);
        await login.navigateToLoginPage();
        await login.loginToCvSite(loginEmail, loginPassword);
        // Ensure post-login is fully settled before persisting storage
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');
        // Optional: if expected profile name is available in env, wait until it appears somewhere on the page
        try {
            if ((ENV as any).TEST_SUPER_ADMIN_NAME) {
                await page.getByText((ENV as any).TEST_SUPER_ADMIN_NAME as string, { exact: false }).first().waitFor({ state: 'visible', timeout: 5000 });
            }
        } catch { /* ignore if not found; storage will still be saved */ }
        await context.storageState({ path: storageStatePath });
        await context.close();
    });
    //#endregion

    test('Create and delete a new user from the user management.', async ({ page, userManagementPage, userManagementNewUserPage }) => {

        let _totalUsers: number = userCreateTestData.users.length;

        await test.step('Navigate to User Management page', async () => {
            await userManagementPage.navigateToUserManagement();
            await page.waitForLoadState('networkidle');
        });

        //#region Delete created test user

        /**
         * @Do not use any real data as testing purpose.
         * @This test first find the users from test data and delete them.
         * @After that again create the users for testing
        */

        await test.step('Check the test users are created or not, if created remove them.', async () => {

            for (let i: number = 0; i < _totalUsers; i++) {
                const userEmail = userCreateTestData.users[i].email

                await test.step(`Search the user '${userEmail}'`, async () => {
                    await userManagementPage.fillTheSearchInput(userEmail);
                    await userManagementPage.clickSearchButton();
                    await page.waitForTimeout(2000);
                    // await page.waitForLoadState('networkidle');

                    if (!await userManagementPage.isNoUserFound()) {
                        await test.step(`Delete the user of ${userCreateTestData.users[i].email}`, async () => {
                            await userManagementPage.clickUserDeleteButton(userEmail);
                            await userManagementPage.clickConfirmDeleteButton();

                            expect.soft(await userManagementPage.getToasterMessageConfirmation()).toContain('deleted successfully');
                        });
                    } else {
                        await test.step(`No user found for the ${userCreateTestData.users[i].email}`, async () => {
                            /* Keep it as blank 
                            @ this only for the reporting purpose
                            */
                        });

                    }
                });
            }
        });
        //#endregion

        await test.step('Fill in new user details information, create the user and Verify them.', async () => {

            for (let i: number = 0; i < _totalUsers; i++) {
                const userEmail = userCreateTestData.users[i].email;

                await test.step(`Click on Add User button for the '${userEmail}' user.`, async () => {
                    await userManagementPage.clickOnAddUserButton();
                });

                await test.step(`Enter Name for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.enterName(userCreateTestData.users[i].name);
                });

                await test.step(`Select Date of Birth for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.selectDateOfBirthSpecific("1");
                });

                await test.step(`Enter Email for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.enterEmail(userCreateTestData.users[i].email);
                });

                await test.step(`Enter Password for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.enterPassword(userCreateTestData.users[i].password);
                });

                await test.step(`Enter Employee ID for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.enterEmployeeId(userCreateTestData.users[i].employeeId);
                });

                await test.step(`Select Role as Employee for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.selectRole(userCreateTestData.users[i].role);
                });

                await test.step(`Select Manager for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.selectManager(userCreateTestData.users[i].managerBSID);
                    await page.waitForTimeout(1000);
                });

                await test.step(`Select SBU for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.selectSBU(userCreateTestData.users[i].sbu);
                });

                await test.step(`Select Experience for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.selectExpertise(userCreateTestData.users[i].expertise);
                });

                await test.step(`Select Resource Type for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.selectResourceType(userCreateTestData.users[i].resourceType);
                });

                await test.step(`Select Date of Joining for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.selectDateOfJoiningSpecific("1");
                    await page.waitForTimeout(1000);
                });
                await test.step(`Select Career Start Date for the '${userEmail}'`, async () => {
                    await userManagementNewUserPage.selectCareerStartDateSpecific("1");
                });

                await test.step(`Click on Create User button to create the user of '${userEmail}'`, async () => {
                    await userManagementNewUserPage.clickUserSubmitButton();

                    // Optionally, verify user creation success message here
                    const createMessage = await userManagementPage.getToasterMessageConfirmation();
                    expect.soft(createMessage).toContain(`${userCreateTestData.users[i].name} has been added successfully.`);
                });

                await test.step(`Verify that the user name of '${userCreateTestData.users[i].name}' has been created successfully.`, async () => {
                    const userEmail = userCreateTestData.users[i].email;

                    await test.step('Search the customer by email', async () => {
                        await userManagementPage.fillTheSearchInput(userEmail);
                        await userManagementPage.clickSearchButton();
                        await userManagementPage.expandUserInfo(userEmail);
                    });

                    await test.step('Verify the user name', async () => {
                        expect.soft(await userManagementPage.getUserName(userEmail)).toEqual(userCreateTestData.users[i].name);
                    });

                    await test.step('Verify the user BS ID', async () => {
                        expect.soft(await userManagementPage.getUserEmployeeID(userEmail)).toEqual(userCreateTestData.users[i].employeeId);
                    });

                    await test.step('Verify the user role', async () => {
                        expect.soft(await userManagementPage.getUserRole(userEmail)).toEqual(userCreateTestData.users[i].role);
                    });

                    await test.step('Verify the user SBU', async () => {
                        expect.soft(await userManagementPage.getUserSBU(userEmail)).toEqual(userCreateTestData.users[i].sbu);
                    });

                    await test.step('Verify the user Expertise', async () => {
                        expect.soft(await userManagementPage.getUserExpertiseInfo()).toEqual(userCreateTestData.users[i].expertise);
                        await page.waitForTimeout(1000);
                    });

                    await test.step('Verify the resource type', async () => {
                        expect.soft(await userManagementPage.getResourceTypeInfo()).toEqual(userCreateTestData.users[i].resourceType);
                    });
                });

            }
        });

        await test.step('Remove the created test data.', async () => {
            let _totalUsers: number = userCreateTestData.users.length;

            for (let i: number = 0; i < _totalUsers; i++) {
                const userEmail = userCreateTestData.users[i].email;

                await test.step(`Search the user '${userEmail}'`, async () => {
                    await userManagementPage.fillTheSearchInput(userEmail);
                    await userManagementPage.clickSearchButton();
                    await page.waitForTimeout(2000);
                    // await page.waitForLoadState('networkidle');

                    if (!await userManagementPage.isNoUserFound()) {
                        await test.step(`Delete the user of ${userCreateTestData.users[i].email}`, async () => {
                            await userManagementPage.clickUserDeleteButton(userEmail);
                            await userManagementPage.clickConfirmDeleteButton();

                            expect.soft(await userManagementPage.getToasterMessageConfirmation()).toContain('deleted successfully');
                        });
                    } else {
                        await test.step(`No user found for the ${userCreateTestData.users[i].email}`, async () => {
                            /* Keep it as blank 
                            @ this only for the reporting purpose
                            */
                        });

                    }
                });
            }
        });

    });

    test('Update and delete user information from the user management.', async ({ page, userManagementPage, userManagementNewUserPage }) => {

        let _totalUsers: number = userCreateTestData.users.length;

        await test.step('Navigate to the user management page', async () => {
            await userManagementPage.navigateToUserManagement();
            await page.waitForLoadState('networkidle');
        });

        //#region Create not existing test users
        await test.step(`Create not existing test users.`, async () => {

            for (let i: number = 0; i < _totalUsers; i++) {
                const userEmail = userCreateTestData.users[i].email;

                await test.step(`Search the user for '${userCreateTestData.users[i].email}'`, async () => {
                    await userManagementPage.fillTheSearchInput(userEmail);
                    await userManagementPage.clickSearchButton();
                    await page.waitForTimeout(2000);

                    if (await userManagementPage.isNoUserFound()) {
                        await test.step(`User not found! Create the test user for ${userCreateTestData.users[i].email}`, async () => {
                            await userManagementPage.clickOnAddUserButton();
                            await page.waitForLoadState('networkidle');

                            await userManagementNewUserPage.enterName(userCreateTestData.users[i].name);
                            await userManagementNewUserPage.selectDateOfBirthSpecific("1");
                            await userManagementNewUserPage.enterEmail(userEmail);
                            await userManagementNewUserPage.enterPassword(userCreateTestData.users[i].password);

                            await userManagementNewUserPage.enterEmployeeId(userCreateTestData.users[i].employeeId);
                            await userManagementNewUserPage.selectRole(userCreateTestData.users[i].role);
                            await userManagementNewUserPage.selectManager(userCreateTestData.users[i].managerBSID);
                            await page.waitForTimeout(1000);
                            await userManagementNewUserPage.selectSBU(userCreateTestData.users[i].sbu);
                            await userManagementNewUserPage.selectExpertise(userCreateTestData.users[i].expertise);
                            await userManagementNewUserPage.selectResourceType(userCreateTestData.users[i].resourceType);

                            await userManagementNewUserPage.selectDateOfJoiningSpecific("1");
                            await page.waitForTimeout(1000);
                            await userManagementNewUserPage.selectCareerStartDateSpecific("1");

                            await userManagementNewUserPage.clickUserSubmitButton();


                            const createMessage = await userManagementPage.getToasterMessageConfirmation();
                            expect.soft(createMessage).toContain(`${userCreateTestData.users[i].name} has been added successfully.`);
                        });
                    } else {
                        await test.step(`User found for the ${userCreateTestData.users[i].email}`, async () => {
                            /* Keep it as blank 
                            @ this only for the reporting purpose
                            */
                        });

                    }
                });
            }

        });
        //#endregion

        for (let i: number = 0; i < _totalUsers; i++) {
            const userEmail = userCreateTestData.users[i].email;
            await test.step(`Search the user for ${userEmail}`, async () => {
                await userManagementPage.fillTheSearchInput(userEmail);
                await userManagementPage.clickSearchButton();
                await page.waitForTimeout(2000);
            });

            await test.step(`Go to the user update page for ${userEmail}`, async () => {
                await userManagementPage.clickUserEditButton(userEmail);
            });

            await test.step(`Update the test user name for ${userEmail}.`, async () => {
                await userManagementNewUserPage.enterName(userCreateTestData.users[i].updatedValues.name);
            });

            await test.step(`Update the test user employee ID for ${userEmail}.`, async () => {
                await userManagementNewUserPage.enterEmployeeId(userCreateTestData.users[i].updatedValues.employeeId);
            });

            await test.step(`Update the test user SBU for ${userEmail}.`, async () => {
                await userManagementNewUserPage.selectSBU(userCreateTestData.users[i].updatedValues.sbu);
            });

            await test.step(`Click the update button.`, async () => {
                await userManagementNewUserPage.clickUserSubmitButton();
                expect.soft(await userManagementPage.getToasterMessageConfirmation()).toContain("updated");
            });

            // Verify that user updated successfully

            await test.step(`Verify that user updated successfully '${userEmail}'.`, async () => {
                await test.step('Search the customer by email', async () => {
                    await userManagementPage.fillTheSearchInput(userEmail);
                    await userManagementPage.clickSearchButton();
                    await userManagementPage.expandUserInfo(userEmail);
                });

                await test.step('Verify the user name', async () => {
                    expect.soft(await userManagementPage.getUserName(userEmail)).toEqual(userCreateTestData.users[i].updatedValues.name);
                });

                await test.step('Verify the user BS ID', async () => {
                    expect.soft(await userManagementPage.getUserEmployeeID(userEmail)).toEqual(userCreateTestData.users[i].updatedValues.employeeId);
                });

                await test.step('Verify the user role', async () => {
                    expect.soft(await userManagementPage.getUserRole(userEmail)).toEqual(userCreateTestData.users[i].role);
                });

                await test.step('Verify the user SBU', async () => {
                    await page.waitForTimeout(1000);
                    expect.soft(await userManagementPage.getUserSBU(userEmail)).toEqual(userCreateTestData.users[i].updatedValues.sbu);
                });

                await test.step('Verify the user Expertise', async () => {
                    expect.soft(await userManagementPage.getUserExpertiseInfo()).toEqual(userCreateTestData.users[i].expertise);
                    await page.waitForTimeout(1000);
                });

                await test.step('Verify the resource type', async () => {
                    expect.soft(await userManagementPage.getResourceTypeInfo()).toEqual(userCreateTestData.users[i].resourceType);
                });
            });
        }

        await test.step('Remove the created test data.', async () => {

            for (let i: number = 0; i < _totalUsers; i++) {
                const userEmail = userCreateTestData.users[i].email

                await test.step(`Search the user '${userEmail}'`, async () => {
                    await userManagementPage.fillTheSearchInput(userEmail);
                    await userManagementPage.clickSearchButton();
                    await page.waitForTimeout(2000);
                    // await page.waitForLoadState('networkidle');

                    if (!await userManagementPage.isNoUserFound()) {
                        await test.step(`Delete the user of ${userCreateTestData.users[i].email}`, async () => {
                            await userManagementPage.clickUserDeleteButton(userEmail);
                            await userManagementPage.clickConfirmDeleteButton();

                            expect.soft(await userManagementPage.getToasterMessageConfirmation()).toContain('deleted successfully');
                        });
                    } else {
                        await test.step(`No user found for the ${userCreateTestData.users[i].email}`, async () => {
                            /* Keep it as blank 
                            @ this only for the reporting purpose
                            */
                        });

                    }
                });
            }
        });

    });

});