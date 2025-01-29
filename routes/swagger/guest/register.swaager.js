/**
 * @swagger
 * /api/v1/school/register:
 *   post:
 *     tags:
 *       - School
 *     summary: Register a new school
 *     description: Register a new school with all required details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - country_code
 *               - mobile_no
 *               - name
 *               - password
 *               - otp
 *               - otpid
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: First name of the school admin. *
 *                 example: Alok
 *               last_name:
 *                 type: string
 *                 description: Last name of the school admin. *
 *                 example: Prabhakar
 *               email:
 *                 type: string
 *                 description: Email address of the school admin. *
 *                 example: snpkids@yopmail.com
 *               country_code:
 *                 type: string
 *                 description: Country code for the mobile number. *
 *                 example: +91
 *               mobile_no:
 *                 type: string
 *                 description: Mobile number of the school admin. *
 *                 example: 8986234846
 *               name:
 *                 type: string
 *                 description: Name of the school. *
 *                 example: SNP KIDS SCHOOL
 *               password:
 *                 type: string
 *                 description: Password for the account. *
 *                 example: snpkids@yopmail.com
 *               otp:
 *                 type: string
 *                 description: One-time password for verification. *
 *                 example: 1234
 *               otpid:
 *                 type: string
 *                 description: OTP ID for verification. *
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Successful registration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: School registered successfully.
 *       '400':
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation failed.
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Invalid input data.
 */





/**
 * @swagger
 * /api/v1/school/login:
 *   post:
 *     tags:
 *       - School
 *     summary: Log in as a school admin
 *     description: Authenticate the school admin and generate a JWT token upon successful login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the school admin. *
 *                 example: snpkids@yopmail.com
 *               password:
 *                 type: string
 *                 description: Password for the account. *
 *                 example: snpkids@yopmail.com
 *     responses:
 *       '200':
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation was successful.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: Login successful!
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: User ID.
 *                       example: 1
 *                     name:
 *                       type: string
 *                       description: Full name of the user.
 *                       example: Alok Prabhakar
 *                     email:
 *                       type: string
 *                       description: Email address of the user.
 *                       example: snpkids@yopmail.com
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       '401':
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Invalid credentials.
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: User not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the operation failed.
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Something went wrong!
 */
