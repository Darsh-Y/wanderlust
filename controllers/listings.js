const listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListing = await listing.find({});
  res.render("./listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  const foundlisting = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!foundlisting) {
    req.flash("error", "Listing you're trying to access does not exists");
    res.redirect("/listings");
  }
  res.render("./listing/show.ejs", { listing: foundlisting });
  console.log(foundlisting);
};

module.exports.createListing = async (req, res, next) => {
  try {
    // Check if required environment variables are set
    if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
      req.flash("error", "Server configuration error. Please contact administrator.");
      return res.redirect("/listings/new");
    }
    
  const { location } = req.body.listing;
    
    // Simple geocoding with fallback
    let coordinates = { lat: 20.5937, lon: 78.9629 }; // Default to India center
    
    try {
  const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
        {
          headers: {
            'User-Agent': 'Wanderlust/1.0 (https://wanderlust-36a8.onrender.com)',
            'Accept': 'application/json'
          }
        }
      );
      
      if (geoResponse.ok) {
  const geoData = await geoResponse.json();
        if (geoData.length > 0) {
          coordinates = {
            lat: parseFloat(geoData[0].lat),
            lon: parseFloat(geoData[0].lon)
          };
        }
      }
    } catch (error) {
      console.log("Geocoding failed, using default coordinates");
    }

  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.geometry = {
    type: "Point",
      coordinates: [coordinates.lon, coordinates.lat],
  };
    
    if (req.file) {
  newListing.image = {
    url: req.file.path,
    filename: req.file.filename,
  };
    }

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
  } catch (error) {
    console.error("Error creating listing:", error);
    req.flash("error", "Failed to create listing. Please try again.");
    res.redirect("/listings/new");
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const editlisting = await listing.findById(id);
  if (!editlisting) {
    req.flash("error", "Listing you're trying to access does not exists");
    res.redirect("/listings");
  }

  let originalImage = editlisting.image.url;
  let newImageUrl = originalImage.replace("/upload", "/upload/h_200");
  // console.log(editlisting);
  res.render("./listing/edit.ejs", { listing: editlisting, newImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let updatedListing = await listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  req.flash("success", "Listing Deleted!");
  res.redirect(`/listings`);
};
