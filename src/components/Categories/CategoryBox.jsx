import { useNavigate, useSearchParams } from "react-router-dom";
import queryString from 'query-string';

const CategoryBox = ({label, icon: Icon}) => {
    const [params] = useSearchParams();
    // const value = params.get('category');
    const navigate = useNavigate();

    const handleCategoryQuery = () => {
        let currentQuery = {};
        if(params){
            currentQuery =queryString.parse(params.toString()) ;
        }

        const updatedQuery = {
            ...currentQuery,
            category : label,
        }

        const url = queryString.stringifyUrl(
            {
                url: '/',
                query: updatedQuery,
            },
            {skipNull:true}
        )
        navigate(url)
    }
    return (
        <div onClick={handleCategoryQuery}
         className="flex cursor-pointer flex-col items-center justify-center gap-2 border-b-2 hover:text-neutral-800 border-transparent text-neutral-500">
            <Icon size={20}></Icon>
            <div className="text-sm font-medium">{label}</div>
        </div>
    );
};

export default CategoryBox;  