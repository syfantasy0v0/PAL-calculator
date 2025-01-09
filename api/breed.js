const breedingData = require('../data/breeding.json');

export default function handler(req, res) {
    const { id, name, parent1, parent2 } = req.query;
    
    try {
        let results = [];
        
        if (id) {
            // 通过ID3搜索
            results = breedingData.filter(item => item.ID3 == id);
            // 去重处理
            results = removeDuplicates(results);
        } else if (name) {
            // 通过PL3搜索
            results = breedingData.filter(item => item.PL3 === name);
            // 去重处理
            results = removeDuplicates(results);
        } else if (parent1 && parent2) {
            // 通过父母名称搜索（考虑顺序互换）
            results = breedingData.filter(item => 
                (item.PL1 === parent1 && item.PL2 === parent2) ||
                (item.PL1 === parent2 && item.PL2 === parent1)
            );
        }

        // 格式化返回结果
        const formattedResults = results.map(item => ({
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

        res.status(200).json({
            success: true,
            data: formattedResults
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Internal server error",
            message: error.message
        });
    }
}

// 去重函数，基于配种结果和父母组合（不考虑顺序）
function removeDuplicates(array) {
    const seen = new Set();
    return array.filter(item => {
        // 创建一个唯一键，使用父母ID的排序组合
        const parentIds = [item.ID1, item.ID2].sort().join('-');
        const key = `${item.ID3}-${parentIds}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}
