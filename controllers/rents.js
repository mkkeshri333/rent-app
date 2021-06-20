
const Rent = require('../models/rent');

module.exports.index=async (req, res) => {
    const rents = await Rent.find({});
    res.render('rents/index', { rents });
    //console.log('success');
}

module.exports.renderNewForm=(req, res) => {

    res.render('rents/new');
}

module.exports.createRent=async (req, res, next) => {
    
    
    const rent = new Rent(req.body.rent);
    rent.images = req.files.map(f=>({url:f.path,filename:f.filename }));
    rent.author = req.user._id;
    await rent.save();
    console.log(rent);
    req.flash('success', 'Successfully created a New rent');

    res.redirect(`/rent/${rent._id}`);

}

module.exports.showRent=async (req, res) => {
    const rent = await Rent.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');

    if (!rent) {
        req.flash('error', 'Can not find Rent');
        return res.redirect('/rent');
    }
    res.render('rents/show', { rent })
}

module.exports.renderEditForm=async (req, res) => {
    
    const {id}=req.params;
    const rent = await Rent.findById(req.params.id)

    if (!rent) {
        req.flash('error', 'Can not find rent-home');
        return res.redirect('/rent');
    }

    res.render('rents/edit', { rent })

}


module.exports.updateRent=async (req, res) => {
    const { id } = req.params;
    const rent = await Rent.findByIdAndUpdate(id, { ...req.body.rent });
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename }));
    rent.images.push(...imgs);
    await rent.save();
    req.flash('success', 'Successfully Updated  Rent-Home');
    res.redirect(`/rent/${rent._id}`);
}


module.exports.deleteRent=async (req, res) => {
    const { id } = req.params;
    await Rent.findByIdAndDelete(id);
    res.redirect('/rent');
}