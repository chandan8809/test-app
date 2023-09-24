import React, { useState } from 'react'
import { Card } from 'primereact/card';
import { Checkbox } from "primereact/checkbox";

const Data=[
    {
     question:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam ",
     options:[
        { name: 'Accounting', key: 'accounting' },
        { name: 'Marketing', key: 'marketing' },
        { name: 'Production', key: 'production' },
        { name: 'Research', key: 'research' }
     ]
    },
    {
     question:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt ",
     options:[
        { name: 'Tomato', key: 'tomato' },
        { name: 'Potato', key: 'potato' },
        { name: 'Chile', key: 'chile' },
        { name: 'Powder', key: 'powder' }
     ]
    },
    {
     question:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt ",
     options:[
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' }
     ]
    },
  
   
]

const MockTest = () => {
    const categories = [
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' }
    ];
    const [selectedCategories, setSelectedCategories] = useState([categories[1]]);

    const onCategoryChange = (e) => {
        let _selectedCategories = [...selectedCategories];

        if (e.checked)
            _selectedCategories.push(e.value);
        else
            _selectedCategories = _selectedCategories.filter(category => category.key !== e.value.key);

        setSelectedCategories(_selectedCategories);
    };
  return (
    <div >
        {Data.map((each,idx)=>(

                <Card key={idx} className='mb-2 bg-gray-500  border border-gray-300'>
                    <div className='flex gap-2'>
                        <div className='left'>
                            Q{idx+1}.

                        </div>
                        <div className='right'>
                            <p className="m-0">
                                {each.question}
                            </p>

                            <div className="card flex mt-4">
                                <div className="flex flex-col gap-2">
                                    {each.options.map((category) => {
                                        return (
                                            <div key={category.key} className="flex items-center">
                                                <Checkbox 
                                                  inputId={category.key} 
                                                   name="category" 
                                                   value={category} 
                                                   onChange={onCategoryChange} 
                                                   checked={selectedCategories.some((item) => item.key === category.key)} 
                                                   />

                                                <label htmlFor={category.key} className="ml-2">
                                                    {category.name}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
            </Card>
        ))}
           
      
    </div>
  )
}

export default MockTest