
import React, { FormEvent, useEffect, useState } from 'react'
import { Categories } from '~/pages';
import { Checkbox } from './ui/checkbox/Checkbox';

type Props = {
    categories: Categories;
    myfunc: React.Dispatch<React.SetStateAction<Categories>>
}

const SelectCategories = ({ categories, myfunc }: Props) => {
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    }



    return (
        <div>
            <form action="" onSubmit={onSubmit} className="">


                {Object.keys(categories).map((category, index) => {
                    return (
                        <label htmlFor={category} className="flex flex-row gap-5 justify-between" key={index}>
                            {category}
                            <Checkbox name={category} id={category} onCheckedChange={(checked) => {

                                if (checked != "indeterminate") {
                                    myfunc(prevState => ({
                                        ...prevState,
                                        [category]: { active: checked }
                                    }));
                                }

                            }}></Checkbox>
                        </label>
                    )
                }
                )
                }

            </form>
        </div>
    )
}

export default SelectCategories