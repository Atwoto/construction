// Test endpoint for project stats
export default async function handler(request, response) {
  try {
    // Import the project controller
    const ProjectController = require('../backend/src/controllers/projectController');
    const projectController = new ProjectController();
    
    // Create a mock request and response object
    const mockReq = {
      query: {}
    };
    
    const mockRes = {
      json: (data) => {
        response.status(200).json(data);
      }
    };
    
    // Call the getProjectStats method
    await projectController.getProjectStats(mockReq, mockRes);
  } catch (error) {
    console.error('Project stats test error:', error);
    response.status(500).json({
      status: 'error',
      message: 'Project stats test failed',
      error: error.message
    });
  }
}