import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  /**************************************************************************** */
  // this code repo helped me - https://github.com/pavankomarina/cloud-developer/blob/master/course-02/project/image-filter-starter-code/src/server.ts
  //! END @TODO1
  
  app.get('/filteredimage', async (req, res) => {
    
    // 1. validate the image_url query
    let { image_url } = req.query;

    // check if image_url is valid
    if (!image_url) {
      return res.status(400).send({ message: 'Please provide a valid image url'});
    }

    // 2. call filterImageFromURL(image_url) to filter the image
    const filteredimage = await filterImageFromURL(image_url);

    // 3. send the resulting file in the response
    //res.status(200).sendFile(filteredimage);
    res.status(201).sendFile(filteredimage, async() => {

    // 4. delete the image files on the server
      await deleteLocalFiles([filteredimage])
    }); 
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();