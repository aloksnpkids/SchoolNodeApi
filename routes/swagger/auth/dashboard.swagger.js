/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get user dashboard data
 *     description: Fetch dashboard data for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Dashboard data fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: Dashboard data fetched successfully!
 *                 data:
 *                   type: string
 *                   description: The fetched dashboard data (this is a placeholder in the example).
 *                   example: 'data'
 *       '401':
 *         description: Unauthorized. Invalid or missing JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Unauthorized. Invalid or missing JWT token.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *                   example: Something went wrong!
 *                 error:
 *                   type: string
 *                   description: Error details.
 *                   example: Error details here.
 */
