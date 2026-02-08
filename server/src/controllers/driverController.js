const Driver = require('../models/Driver');

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Public
const getDrivers = async (req, res) => {
    try {
        console.log("✓ Fetching all drivers from database...");
        const drivers = await Driver.find().sort({ createdAt: -1 });
        console.log(`✓ Found ${drivers.length} drivers`);
        res.json(drivers);
    } catch (error) {
        console.error("✗ Error fetching drivers:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single driver
// @route   GET /api/drivers/:id
// @access  Public
const getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new driver
// @route   POST /api/drivers
// @access  Public
const createDriver = async (req, res) => {
    try {
        console.log("✓ Creating new driver with data:", req.body);
        const { name, licenseNumber, nic, dateOfBirth, address, phone, email } = req.body;

        // Validation
        if (!name || !licenseNumber || !nic) {
            console.log("✗ Validation failed: Missing required fields");
            return res.status(400).json({
                message: 'Name, License Number, and NIC are required fields'
            });
        }

        // Check if driver with same license number or NIC already exists
        const existingDriver = await Driver.findOne({
            $or: [{ licenseNumber }, { nic }]
        });

        if (existingDriver) {
            console.log("✗ Driver already exists with license or NIC");
            return res.status(400).json({
                message: 'Driver with this license number or NIC already exists'
            });
        }

        const driver = await Driver.create({
            name,
            licenseNumber,
            nic,
            dateOfBirth,
            address,
            phone,
            email
        });

        console.log(`✓ Driver created successfully with ID: ${driver._id}`);
        res.status(201).json(driver);
    } catch (error) {
        console.error("✗ Error creating driver:", error.message);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Public
const updateDriver = async (req, res) => {
    try {
        console.log(`✓ Updating driver with ID: ${req.params.id}`);
        const { name, licenseNumber, nic, dateOfBirth, address, phone, email } = req.body;

        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            console.log(`✗ Driver not found with ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Check if updating to a license number or NIC that already exists
        if (licenseNumber !== driver.licenseNumber || nic !== driver.nic) {
            const existingDriver = await Driver.findOne({
                _id: { $ne: req.params.id },
                $or: [{ licenseNumber }, { nic }]
            });

            if (existingDriver) {
                console.log("✗ Duplicate license number or NIC found");
                return res.status(400).json({
                    message: 'Driver with this license number or NIC already exists'
                });
            }
        }

        driver.name = name || driver.name;
        driver.licenseNumber = licenseNumber || driver.licenseNumber;
        driver.nic = nic || driver.nic;
        driver.dateOfBirth = dateOfBirth !== undefined ? dateOfBirth : driver.dateOfBirth;
        driver.address = address !== undefined ? address : driver.address;
        driver.phone = phone !== undefined ? phone : driver.phone;
        driver.email = email !== undefined ? email : driver.email;

        const updatedDriver = await driver.save();
        console.log(`✓ Driver updated successfully: ${updatedDriver._id}`);
        res.json(updatedDriver);
    } catch (error) {
        console.error("✗ Error updating driver:", error.message);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Public
const deleteDriver = async (req, res) => {
    try {
        console.log(`✓ Deleting driver with ID: ${req.params.id}`);
        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            console.log(`✗ Driver not found with ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Driver not found' });
        }

        await driver.deleteOne();
        console.log(`✓ Driver deleted successfully: ${req.params.id}`);
        res.json({ message: 'Driver removed successfully' });
    } catch (error) {
        console.error("✗ Error deleting driver:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver
};
