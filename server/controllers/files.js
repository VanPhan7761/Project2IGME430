const File = require('../models/filestore.js');

const uploadPage = (req, res) => {
    res.render('upload');
};

const uploadFile = async (req, res) => {
    /* First we will check if req.files doesn't exist, or if it does exist
       we will ensure req.files.sampleFile also exists. If req.files doesn't
       exist it means that the Express-FileUpload library did not find any
       files in the incoming request. If req.files.sampleFile doesn't exist
       it means we were not sent one tagged as sampleFile.
       Express-FileUpload works very similar to bodyParser in that it will
       look for files being sent as a part of POST or PUT requests. When
       it sees one, it will populate the req.files object with them.
       The name sampleFile is arbitrary, and simply comes from the upload
       form in upload.handlebars.
    */

   

    if (!req.files || !req.files.sampleFile ) {
      return res.status(400).json({ error: 'No files were uploaded' });
      }
       

      console.log("req file data:")
      console.log(req.files);
      console.log(req.files.sampleFile);



      /* Now that we know we have req.files AND there is a sampleFile
         entry in that object, we will grab that file. Again, the
         name sampleFile is arbitrary and simply comes from the name
         attribute on the file input on our upload form in upload.handlebars.
      */
      const { sampleFile } = req.files;
  
      /* If you uncomment the line below and run the code, you will be
         able to see what an incoming file object looks like. This can
         be useful as it shows you what data there is to possibly store
         in your database.
      */
      //console.log(sampleFile);
  
  
      /* Once we have our file in memory on our server, we need to store
         it into our database. Take a look at models/filestore.js to see
         what sort of data we are actually storing. You can also uncomment
         the console statement above to see what is sent to us when someone
         uploads a file.
         This process is the same as any other database creation we have
         done in the past. sampleFile is an object, and we have configured
         our file schema to match that format so it is as simple as passing
         sampleFile to the File model and saving the result.
         If there is an error, we will let the user know. Otherwise, we will
         send them a 201 and tell them the file has been created successfully.
         For testing purposes we will also return the _id of the file in 
         the database.
      */
      try {
        const newFile = new File(sampleFile);
        const doc = await newFile.save();

        console.log("file uploaded!");


        
        return res.status(201).json({
          message: 'File stored successfully!',
          fileId: doc._id,
        });
      } catch (err) {
          console.log(err);
          return res.status(400).json({
              error: 'Something went wrong uploading file!'
        });
      }
    };


    const retrieveFile = async (req, res) => {
        /* First ensure that the user gave us an _id. Remember that req.query
           is populated by bodyParser if there are query parameters with the 
           request.
           If they don't send us an _id, we can't look up the file so we will
           send them an error instead.
        */
        if(!req.query._id) {
          return res.status(400).json({ error: 'Missing file id!'});
        }
      
        /* If we have a file id from the user, we can attempt to find the file.
           One of three things can happen. 1) There is an error contacting the
           database (which will send us to the catch statement). 2) The database
           responds but finds no file with that id. 3) The database finds the file.
        */
        try{
          // First we attempt to find the file by the _id sent by the user.
          const doc = await File.findOne({_id: req.query._id}).exec();
      
          /* If the database sends us a result but it is empty, that means that
             there is no file with that _id in the database. In that case, we
             can send a 404 to the user and say that resource doesn't exist.
          */
          if(!doc) {
            return res.status(404).json({ error: 'File not found!' });
          }
      
          /* If we have made it this far in the try statement, we have not hit
             an error AND our doc object contains a file. If that is the case,
             we want to set a few headers to let the browser know some info about
             the file we are sending it.
          */
          res.set({
            // Content-Type tells the browser what type of file it is (png, mp3, zip, etc)
            'Content-Type': doc.mimetype,
      
            // Content-Length tells it how many bytes long it is.
            'Content-Length': doc.size,
              // Adding “attachment; will force file to download when retrieved rather than show
              // Doesn’t have an impact on things like img tags 
              //'Content-Disposition': `attachment; filename="${doc.name}"`
      
            /* Content-Disposition gives the browser some other information about the file.
               Below we can see that we are telling the browser the files name. If we don't
               do this, it will assume the name of the file is /retrieve (since that is the
               url it got it from).
               We can also add "attachment;" as shown in the comment below. By default
               the browser will simply attempt to display the result of the GET request
               to the user if it can. For example, if we send an image, it will redirect
               to a page that just shows the image. However, if we tell it the file should
               be treated as an attachment it will download the file and not redirect the user.
            */
            'Content-Disposition': `filename="${doc.name}"` /* `attachment; filename="${doc.name}"` */
          });
      
          /* Finally once we have set the headers, we can write the actual image data to
             the response and send it back to the user. With the above headers set, the
             browser will know how to properly interpret the data (which is just binary).
          */
          return res.send(doc.data);
        } catch(err){
          // If we have an error contacting the database, let the user know something happened.
          console.log(err);
          return res.status(400).json({ error: 'Something went wrong retrieving file!' });
        }
      };

      module.exports = {
        uploadPage,
        uploadFile,
        retrieveFile
      }
      