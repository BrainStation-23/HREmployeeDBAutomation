import { expect, test } from "../../../lib/base.fixture";
import ENV from '../../../utils/env';
import fs from 'fs';
import path from 'path';
import LoginPage from '../../../pages/login.page';
import ExcelCsvReader from '../../../utils/ExcelCsvReader';
import userCreateTestData from '../../../test_data/UserManagementTestData/createTestUserData.json'; // Test data import
import userSearchTestData from '../../../test_data/UserManagementTestData/userSearchTestData.json';

test.describe("User Management - User Create, Update, Delete Test", () => {

    const loginEmail = ENV.TEST_SUPER_ADMIN_EMAIL as string;
    const loginPassword = ENV.TEST_SUPER_ADMIN_PASSWORD as string;
    const userName = ENV.TEST_SUPER_ADMIN_NAME as string

    // Prepare and apply Playwright authentication storage for all tests in this describe
    const authDir = path.resolve('playwright/.auth');
    const envName = (ENV.ENVIRONMENT_NAME || 'default').toLowerCase();
    const storageStatePath = path.join(authDir, `${userName}.${envName}.json`);

    //#region [BeforeAll Hook] Login Authentication Storage Setup

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
            if (userName) {
                await page.getByText(userName, { exact: false }).first().waitFor({ state: 'visible', timeout: 5000 });
            }
        } catch { /* ignore if not found; storage will still be saved */ }
        await context.storageState({ path: storageStatePath });
        await context.close();
    });

    //#endregion


    //#region [Test] Create and delete a new user

    test('Create and delete a new user from the user management.', { tag: ['@user-management'] }, async ({ page, userManagementPage, userManagementNewUserPage }) => {

        let _totalUsers: number = userCreateTestData.users.length;

        await test.step('Navigate to User Management page', async () => {
            await userManagementPage.navigateToUserManagement();
            await page.waitForLoadState('networkidle');
        });

        //#region Delete created test user

        /**
         * !@ATTENTION
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
                            /** Keep it as blank 
                             * @this only for the reporting purpose
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
                            /** Keep it as blank 
                             * @this only for the reporting purpose
                             */
                        });

                    }
                });
            }
        });

    });

    //#endregion


    //#region [Test] Update and delete user information

    test('Update and delete user information from the user management.', { tag: ['@user-management'] }, async ({ page, userManagementPage, userManagementNewUserPage }) => {

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
                            /** Keep it as blank 
                             * @this only for the reporting purpose
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

    //#endregion


    //#region [Test] Create, Update and Delete bulk users

    test('Bulk users (Create, Update and Delete)  from the user management.', { tag: ['@user-management'] }, async ({ page, userManagementPage }) => {

        let userCreateCsvFilePath: string = 'test_data/UserManagementTestData/user_create.csv';
        let userDeleteCsvFilePath: string = 'test_data/UserManagementTestData/employee_ids_delete.csv';
        let userUpdateCsvFilePath: string = 'test_data/UserManagementTestData/user_update.csv';
        let userExcelReportPath: string = 'test_data/UserManagementTestData/UserExcelReport/excelReport.xlsx';

        let userCreateSheetName: string = 'user_create';
        let userUpdateSheetName: string = 'user_update';
        let userReportSheetName: string = 'Users to Delete';

        let userCreateCsvReader = new ExcelCsvReader(userCreateCsvFilePath);
        let userUpdateCsvReader = new ExcelCsvReader(userUpdateCsvFilePath);
        let userDeleteCsvReader = new ExcelCsvReader(userDeleteCsvFilePath);
        let userReportExcelReader = new ExcelCsvReader(userExcelReportPath);

        let _totalCreateUser: number = await userCreateCsvReader.getRowCount() - 1;
        let _totalUpdateUser: number = await userUpdateCsvReader.getRowCount() - 1;
        let _totalDeleteUser: number = await userDeleteCsvReader.getRowCount();
        let _totalUserReport: number = await userReportExcelReader.getRowCount() - 1;

        /**
         * @CREATE_BULK_USER
         */

        await test.step(`Create bulk users and verify that the users are created.`, async () => {

            await test.step('Navigate to the user management page.', async () => {
                await userManagementPage.navigateToUserManagement();
                await page.waitForLoadState('networkidle');
            });

            await test.step('Upload the create user file for the bulk upload.', async () => {
                await userManagementPage.clickBulkCreateButton();
                await userManagementPage.uploadFile(userCreateCsvFilePath);
            });

            await test.step('Verify the uploaded create user file is valid.', async () => {
                let validUserMsg: string = await userManagementPage.getValidUserNumberForFileUpload() ?? '';
                let validUserNumber: number = parseInt(validUserMsg.replace('\D+', ''));

                let errorMessage: string = await userManagementPage.getErrorNumberForFileUpload() ?? '';
                let errorNumber: number = parseInt(errorMessage.replace('\D+', ''));

                expect.soft(validUserNumber, `Expected valid users count ${_totalCreateUser}, but we found ${validUserNumber}`).toEqual(_totalCreateUser);
                expect.soft(errorNumber, `Expected 0 error will be present, but we found ${errorNumber}`).toEqual(0);

            });

            await test.step('Submit the bulk user create and verify that the users are created.', async () => {
                let buttonUserCountMsg = await userManagementPage.getCreateUpdateUserNumberFromSubmitButton() ?? '';
                expect.soft(buttonUserCountMsg, `Expected message ${_totalCreateUser} in the submit button, but we found ${buttonUserCountMsg}`).toContain(`Create ${_totalCreateUser} Users`);

                await userManagementPage.clickTheBulkSubmitButton();
                await userManagementPage.clickToasterCrossButton();
                await userManagementPage.toasterMessageConfirmation.hover();
                await page.waitForTimeout(1500);

                expect.soft(await userManagementPage.getToasterMessageConfirmation()).toContain(`Successfully processed ${_totalCreateUser} users`);

                for (let i: number = 2; i <= _totalCreateUser + 1; i++) {
                    let userEmail: string = await userCreateCsvReader.getCellData("email", i, userCreateSheetName);
                    let userName: string = await userCreateCsvReader.getCellData("firstName", i, userCreateSheetName);
                    let userRole: string = await userCreateCsvReader.getCellData("role", i, userCreateSheetName);
                    let userEmployeeID: string = await userCreateCsvReader.getCellData("employeeId", i, userCreateSheetName);
                    let userSbuName: string = await userCreateCsvReader.getCellData("sbuName", i, userCreateSheetName);
                    let userExpertiseName: string = await userCreateCsvReader.getCellData("expertiseName", i, userCreateSheetName);
                    let userResourceTypeName = await userCreateCsvReader.getCellData("resourceTypeName", i, userCreateSheetName);

                    await test.step(`Search the user and verify the user information for ${userEmail} from the user list.`, async () => {

                        await userManagementPage.fillTheSearchInput(userEmail);
                        await userManagementPage.clickSearchButton();

                        if (await userManagementPage.isNoUserFound()) {
                            expect.soft(false, `No user found for ${userEmail}`);
                            return;
                        }

                        await userManagementPage.expandUserInfo(userEmail);

                        await test.step('Verify the user name', async () => {
                            expect.soft(await userManagementPage.getUserName(userEmail)).toContain(userName);
                        });

                        await test.step('Verify the user employee ID', async () => {
                            expect.soft(await userManagementPage.getUserEmployeeID(userEmail)).toContain(userEmployeeID);
                        });

                        await test.step('Verify the user role', async () => {
                            expect.soft(await userManagementPage.getUserRole(userEmail)).toContain(userRole);
                        });

                        await test.step('Verify the user SBU', async () => {
                            expect.soft(await userManagementPage.getUserSBU(userEmail)).toContain(userSbuName);
                        });

                        await test.step('Verify the user expertise', async () => {
                            expect.soft(await userManagementPage.getUserExpertiseInfo()).toContain(userExpertiseName);
                        });

                        await test.step('Verify the user resource type', async () => {
                            expect.soft(await userManagementPage.getResourceTypeInfo()).toContain(userResourceTypeName);
                        });

                    });

                }

                await userManagementPage.blankSearch();
                await page.waitForTimeout(1500);

            });
        });


        /**
         * @UPDATE_BULK_USER
         */

        await test.step('Update bulk users and verify that the users are updated', async () => {

            await test.step('Download the user excel report and update user DB Id to the user update csv file', async () => {

                await userManagementPage.clickBulkDeleteButton();
                await userManagementPage.clickDeleteListedRadioButton();
                await userManagementPage.uploadFile(userDeleteCsvFilePath);
                await userManagementPage.clickGeneratePreviewButtonForBulkDelete();
                await userManagementPage.downloadTheDeletedExcelReport(userExcelReportPath);
                await userManagementPage.clickCloseBulkPopupButton();

                for (let i: number = 2; i <= _totalDeleteUser + 1; i++) {
                    const userDBId: string = await userReportExcelReader.getCellData("Database ID", i, userReportSheetName);
                    await userUpdateCsvReader.setCellData("userId", i, userDBId, userUpdateSheetName);
                }
            });

            await test.step('Upload the bulk update file and verify that the file is uploaded.', async () => {
                await userManagementPage.clickBulkUpdateButton();
                await userManagementPage.uploadFile(userUpdateCsvFilePath);

                let validUserMsg: string = await userManagementPage.getValidUserNumberForFileUpload() ?? '';
                let validUserNumber: number = parseInt(validUserMsg.replace('\D+', ''));

                let errorMessage: string = await userManagementPage.getErrorNumberForFileUpload() ?? '';
                let errorNumber: number = parseInt(errorMessage.replace('\D+', ''));

                expect.soft(validUserNumber, `Expected valid users count ${_totalUpdateUser}, but we found ${validUserNumber}`).toEqual(_totalUpdateUser);
                expect.soft(errorNumber, `Expected 0 error will be present, but we found ${errorNumber}`).toEqual(0);
            });

            await test.step('Submit the bulk update user file and verify that the file is submitted.', async () => {
                let buttonUserCountMsg = await userManagementPage.getCreateUpdateUserNumberFromSubmitButton() ?? '';
                expect.soft(buttonUserCountMsg, `Expected message ${_totalCreateUser} in the submit button, but we found ${buttonUserCountMsg}`).toContain(`Update ${_totalCreateUser} Users`);

                await userManagementPage.clickTheBulkSubmitButton();

                // await userManagementPage.clickToasterCrossButton();
                // await userManagementPage.toasterMessageConfirmation.hover();

                await page.waitForTimeout(2000);

                // expect.soft(await userManagementPage.getToasterMessageConfirmation()).toContain(`${_totalCreateUser} users updated`);
            });

            await test.step('Verify all the users are update successfully.', async () => {

                for (let i: number = 2; i <= _totalUpdateUser + 1; i++) {
                    let userEmail: string = await userUpdateCsvReader.getCellData("email", i, userUpdateSheetName);
                    let userName: string = await userUpdateCsvReader.getCellData("firstName", i, userUpdateSheetName);
                    let userRole: string = await userUpdateCsvReader.getCellData("role", i, userUpdateSheetName);
                    let userEmployeeID: string = await userUpdateCsvReader.getCellData("employeeId", i, userUpdateSheetName);
                    let userSbuName: string = await userUpdateCsvReader.getCellData("sbuName", i, userUpdateSheetName);
                    let userExpertiseName: string = await userUpdateCsvReader.getCellData("expertiseName", i, userUpdateSheetName);
                    let userResourceTypeName = await userUpdateCsvReader.getCellData("resourceTypeName", i, userUpdateSheetName);

                    await test.step(`Search the user and verify the user information for ${userEmail} from the user list.`, async () => {

                        await userManagementPage.fillTheSearchInput(userEmail);
                        // await page.waitForTimeout(1500);
                        await userManagementPage.clickSearchButton();

                        // await page.waitForTimeout(1500);

                        if (await userManagementPage.isNoUserFound()) {
                            expect.soft(false, `No user found for ${userEmail}`);
                            return;
                        }

                        await userManagementPage.expandUserInfo(userEmail);
                        await userManagementPage.expandUserInfo(userEmail);

                        await test.step('Verify the user name', async () => {
                            expect.soft(await userManagementPage.getUserName(userEmail)).toContain(userName);
                        });

                        await test.step('Verify the user employee ID', async () => {
                            expect.soft(await userManagementPage.getUserEmployeeID(userEmail)).toContain(userEmployeeID);
                        });

                        await test.step('Verify the user role', async () => {
                            expect.soft(await userManagementPage.getUserRole(userEmail)).toContain(userRole);
                        });

                        await test.step('Verify the user SBU', async () => {
                            expect.soft(await userManagementPage.getUserSBU(userEmail)).toContain(userSbuName);
                        });

                        await test.step('Verify the user expertise', async () => {
                            expect.soft(await userManagementPage.getUserExpertiseInfo()).toContain(userExpertiseName);
                        });

                        await test.step('Verify the user resource type', async () => {
                            expect.soft(await userManagementPage.getResourceTypeInfo()).toContain(userResourceTypeName);
                        });

                    });

                }

            });

        });


        /**
         * @DELETE_BULK_USER
         */

        await test.step('Delete bulk users and verify that delete users are deleted.', async () => {

            await test.step('Click the bulk delete button.', async () => {
                await userManagementPage.clickBulkDeleteButton();
                await userManagementPage.clickDeleteListedRadioButton();
            });

            await test.step('Upload the bulk delete user file.', async () => {
                await userManagementPage.uploadFile(userDeleteCsvFilePath);
                await userManagementPage.clickGeneratePreviewButtonForBulkDelete();
            });

            await test.step('Verify that the users are available.', async () => {

                expect.soft(await userManagementPage.getBulkDeleteWarningMessage()).toContain(`${_totalDeleteUser} users will be permanently deleted`)
                expect.soft(await userManagementPage.getBulkDeletedUserCount()).toContain(`Users to be deleted (${_totalDeleteUser})`);

                for (let i: number = 1; i <= _totalDeleteUser; i++) {

                    let userEmail: string = await userCreateCsvReader.getCellData("email", i + 1, userCreateSheetName);
                    let userName: string = await userCreateCsvReader.getCellData("firstName", i + 1, userCreateSheetName);
                    let userEmployeeID: string = await userCreateCsvReader.getCellData("employeeId", i + 1, userCreateSheetName);

                    expect.soft(
                        await userManagementPage.getBulkDeletedUserNameFromConfirmList(userEmail),
                        `User ${userName} (${userEmail}) not found.`
                    ).toEqual(userName);

                    expect.soft(
                        await userManagementPage.getBulkDeletedUserEmployeeIdFromConfirmList(userEmail),
                        `User ${userName} (${userEmail}) Employee ID ${userEmployeeID} not found.`
                    ).toEqual(userEmployeeID);
                    await page.waitForTimeout(1000);
                }
            });

            await test.step('Click the bulk delete confirm button.', async () => {
                await userManagementPage.clickBulkDeleteConfirmButton();

                expect.soft(
                    await userManagementPage.getToasterMessageConfirmation(), `User not delete successfully.`
                ).toContain(`Successfully deleted ${_totalDeleteUser} users.`);
            });

            await test.step('Verify that the users are deleted successfully.', async () => {

                for (let i: number = 1; i <= _totalDeleteUser; i++) {

                    let userEmail: string = await userCreateCsvReader.getCellData("email", i + 1, userCreateSheetName);

                    await userManagementPage.fillTheSearchInput(userEmail);
                    await userManagementPage.clickSearchButton();
                    await page.waitForTimeout(1500);

                    expect.soft(await userManagementPage.isNoUserFound()).toBeTruthy();
                }

            });

        });

    });

    //#endregion


    //#region [Test] Search, Filter and Export 

    test('Search, Filter and Export test for the user management.', { tag: ['@user-management'] }, async ({ page, userManagementPage }) => {

        let searchName = userSearchTestData.searchKeyWord.name;
        let searchEmail = userSearchTestData.searchKeyWord.email;
        let searchEmployeeID = userSearchTestData.searchKeyWord.employeeID;
        let searchExpertise = userSearchTestData.searchKeyWord.verification.Expertise;
        let searchResourceType = userSearchTestData.searchKeyWord.verification.ResourceType;
        let searchSBU = userSearchTestData.searchKeyWord.verification.SBU;

        let filterByRoles = userSearchTestData.filterKeyWord.filterByRoles;
        let filterSBU = userSearchTestData.filterKeyWord.advancedFilter.sbu;
        let filterManagerName = userSearchTestData.filterKeyWord.advancedFilter.managerName;
        let filterManagerEmployeeID = userSearchTestData.filterKeyWord.advancedFilter.managerEmployeeID;
        let filterResourceType = userSearchTestData.filterKeyWord.advancedFilter.resourceType;
        let filterExpertise = userSearchTestData.filterKeyWord.advancedFilter.expertise;

        await userManagementPage.navigateToUserManagementByURL();
        await page.waitForLoadState("networkidle");

        await test.step('Search by user name and verify the user details.', async () => {

            await test.step('Search by user name.', async () => {
                await userManagementPage.fillTheSearchInput(searchName);
                await userManagementPage.clickSearchButton();

                await userManagementPage.expandUserInfo(searchEmail);
            });

            await test.step('Verify the search result.', async () => {
                await test.step('Verify the user name', async () => {
                    expect.soft(await userManagementPage.getUserName(searchEmail)).toEqual(searchName);
                });

                await test.step('Verify the user BS ID', async () => {
                    expect.soft(await userManagementPage.getUserEmployeeID(searchEmail)).toEqual(searchEmployeeID);
                });

                await test.step('Verify the user SBU', async () => {
                    expect.soft(await userManagementPage.getUserSBU(searchEmail)).toEqual(searchSBU);
                });

                await test.step('Verify the user Expertise', async () => {
                    expect.soft(await userManagementPage.getUserExpertiseInfo()).toEqual(searchExpertise);
                    await page.waitForTimeout(1000);
                });

                await test.step('Verify the resource type', async () => {
                    expect.soft(await userManagementPage.getResourceTypeInfo()).toEqual(searchResourceType);
                });
            });

        });

        await test.step('Search by employee ID and verify the user details.', async () => {

            await test.step('Search by user name.', async () => {
                await page.reload();
                await page.waitForLoadState("networkidle");
                await userManagementPage.fillTheSearchInput(searchEmployeeID);
                await userManagementPage.clickSearchButton();

                await userManagementPage.expandUserInfo(searchEmail);
            });

            await test.step('Verify the search result.', async () => {
                await test.step('Verify the user name', async () => {
                    expect.soft(await userManagementPage.getUserName(searchEmail)).toEqual(searchName);
                });

                await test.step('Verify the user BS ID', async () => {
                    expect.soft(await userManagementPage.getUserEmployeeID(searchEmail)).toEqual(searchEmployeeID);
                });

                await test.step('Verify the user SBU', async () => {
                    expect.soft(await userManagementPage.getUserSBU(searchEmail)).toEqual(searchSBU);
                });

                await test.step('Verify the user Expertise', async () => {
                    expect.soft(await userManagementPage.getUserExpertiseInfo()).toEqual(searchExpertise);
                    await page.waitForTimeout(1000);
                });

                await test.step('Verify the resource type', async () => {
                    expect.soft(await userManagementPage.getResourceTypeInfo()).toEqual(searchResourceType);
                });
            });

        });

        await test.step('Filter by role and verify the user from the user management page.', async () => {

            await page.reload();
            await page.waitForLoadState("networkidle");

            let _totalUsers = await userManagementPage.getSearchResultCount();

            await test.step('Select the filter by role.', async () => {
                await userManagementPage.selectFilterByRole(filterByRoles);
                await userManagementPage.clickSearchButton();
            });

            await test.step('Verify that the filter is applied', async () => {
                let filterSearchResult = await userManagementPage.getSearchResultCount();

                expect.soft(filterSearchResult).toBeLessThan(_totalUsers);
            });

        });

        await test.step('Advance filter by SBU and verify the user from the user management page.', async () => {

            await page.reload();
            await page.waitForLoadState("networkidle");

            let _totalUsers = await userManagementPage.getSearchResultCount();

            await test.step('Select the filter by sbu.', async () => {

                await userManagementPage.clickAdvanceFiltersButton();
                await userManagementPage.selectFilterBySBU(filterSBU);
                await userManagementPage.clickApplyFilterButton();
                await page.waitForTimeout(1500);
            });

            await test.step('Verify that the filter is applied', async () => {
                let filterSearchResult = await userManagementPage.getSearchResultCount();

                expect.soft(filterSearchResult).toBeLessThan(_totalUsers);
            });

        });

        await test.step('Advance filter by manager name and verify the user from the user management page.', async () => {

            await page.reload();
            await page.waitForLoadState("networkidle");

            let _totalUsers = await userManagementPage.getSearchResultCount();

            await test.step('Select the filter by manager name.', async () => {

                await userManagementPage.clickAdvanceFiltersButton();
                await userManagementPage.selectFilterByManager(filterManagerName);
                await userManagementPage.clickApplyFilterButton();
                await page.waitForTimeout(1500);
            });

            await test.step('Verify that the filter is applied', async () => {
                let filterSearchResult = await userManagementPage.getSearchResultCount();

                expect.soft(filterSearchResult).toBeLessThan(_totalUsers);
            });

        });

        await test.step('Advance filter by manager employee ID and verify the user from the user management page.', async () => {

            await page.reload();
            await page.waitForLoadState("networkidle");

            let _totalUsers = await userManagementPage.getSearchResultCount();

            await test.step('Select the filter by manager employee ID.', async () => {

                await userManagementPage.clickAdvanceFiltersButton();
                await userManagementPage.selectFilterByManager(filterManagerEmployeeID);
                await userManagementPage.clickApplyFilterButton();
                await page.waitForTimeout(1500);
            });

            await test.step('Verify that the filter is applied', async () => {
                let filterSearchResult = await userManagementPage.getSearchResultCount();

                expect.soft(filterSearchResult).toBeLessThan(_totalUsers);
            });

        });

        await test.step('Advance filter by resource type and verify the user from the user management page.', async () => {

            await page.reload();
            await page.waitForLoadState("networkidle");

            let _totalUsers = await userManagementPage.getSearchResultCount();

            await test.step('Select the filter by resource type.', async () => {

                await userManagementPage.clickAdvanceFiltersButton();
                await userManagementPage.selectFilterByResourceType(filterResourceType);
                await userManagementPage.clickApplyFilterButton();
                await page.waitForTimeout(1500);
            });

            await test.step('Verify that the filter is applied', async () => {
                let filterSearchResult = await userManagementPage.getSearchResultCount();

                expect.soft(filterSearchResult).toBeLessThan(_totalUsers);
            });

        });

        await test.step('Advance filter by expertise and verify the user from the user management page.', async () => {

            await page.reload();
            await page.waitForLoadState("networkidle");

            let _totalUsers = await userManagementPage.getSearchResultCount();

            await test.step('Select the filter by expertise.', async () => {

                await userManagementPage.clickAdvanceFiltersButton();
                await userManagementPage.selectFilterByExpertise(filterExpertise);
                await userManagementPage.clickApplyFilterButton();
                await page.waitForTimeout(1500);
            });

            await test.step('Verify that the filter is applied', async () => {
                let filterSearchResult = await userManagementPage.getSearchResultCount();

                expect.soft(filterSearchResult).toBeLessThan(_totalUsers);
            });

        });

        await test.step('Verify that the admin can export all the data from the user management page.', async () => {

            await page.reload();
            await page.waitForLoadState("networkidle");

            let exportedFileFolderPath = 'test_data/UserManagementTestData/ExportData';
            const _totalUser = await userManagementPage.getSearchResultCount();

            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            const fileName = `users_export_${formattedDate}.csv`;
            const filePath = `${exportedFileFolderPath}/${fileName}`;

            await test.step('Download the user details.', async () => {
                await userManagementPage.downloadExportAllUserData(exportedFileFolderPath, fileName);
            });

            await test.step('Verify that the file downloaded successfully.', async () => {

                /**
                 * Verify that the file is present
                 */
                expect.soft(fs.existsSync(filePath)).toBeTruthy();

                /**
                 * Verify that the file size is not less than 0
                 */
                const stats = fs.statSync(filePath);
                expect.soft(stats.size).toBeGreaterThan(0);

                /**
                 * Verify that the total user are exported or not
                 */
                const exportAllUserCSV = new ExcelCsvReader(filePath);
                const _totalUserOnCSV = await exportAllUserCSV.getRowCount() - 1;

                expect.soft(_totalUserOnCSV).toEqual(_totalUser);
            });

        });
        
    });
    //#endregion
});    