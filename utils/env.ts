export default class ENV {
    public static ENVIRONMENT_NAME = process.env.ENVIRONMENT_NAME
    public static BASE_URL = process.env.BASE_URL

    public static TEST_SUPER_ADMIN_EMAIL = process.env.TEST_SUPER_ADMIN_EMAIL
    public static TEST_SUPER_ADMIN_PASSWORD = process.env.TEST_SUPER_ADMIN_PASSWORD

    public static TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL
    public static TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD

    public static TEST_MANAGER_EMAIL = process.env.TEST_MANAGER_EMAIL
    public static TEST_MANAGER_PASSWORD = process.env.TEST_MANAGER_PASSWORD
    public static TEST_MANAGER_NAME=process.env.TEST_MANAGER_NAME

    public static TEST_EMPLOYEE_EMAIL = process.env.TEST_EMPLOYEE_EMAIL
    public static TEST_EMPLOYEE_PASSWORD = process.env.TEST_EMPLOYEE_PASSWORD
     public static TEST_EMPLOYEE_NAME=process.env.TEST_EMPLOYEE_NAME

    public static TEST_SHADOW_SBU_EMAIL = process.env.TEST_SHADOW_SBU_EMAIL
    public static TEST_SHADOW_SBU_NAME = process.env.TEST_SHADOW_SBU_NAME
    public static TEST_SHADOW_SBU_PASSWORD = process.env.TEST_SHADOW_SBU_PASSWORD
}
