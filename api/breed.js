const breedingData = require('../data/breeding.json');

export default function handler(req, res) {
    const { id, name } = req.query;
    
    try {
        let results = [];
        
        if (id) {
            // 通过ID3搜索
            results = breedingData.filter(item => item.ID3 == id)
                .map(item => ({
                    parent1: {
                        id: item.ID1,
                        name: item.PL1
                    },
                    parent2: {
                        id: item.ID2,
                        name: item.PL2
                    },
                    result: {
                        id: item.ID3,
                        name: item.PL3
                    }
                }));
        } else if (name) {
            // 通过PL3搜索
            results = breedingData.filter(item => item.PL3 === name)
                .map(item => ({
                    parent1: {
                        id: item.ID1,
                        name: item.PL1
                    },
                    parent2: {
                        id: item.ID2,
                        name: item.PL2
                    },
                    result: {
                        id: item.ID3,
                        name: item.PL3
                    }
                }));
        }

        res.status(200).json({
            success: true,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: error.message
        });
    }
}
