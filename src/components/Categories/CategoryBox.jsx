
const CategoryBox = ({label, icon: Icon}) => {
    return (
        <div className="flex flex-col items-center justify-center gap-2 border-b-2 hover:text-neutral-800 border-transparent text-neutral-500">
            <Icon size={20}></Icon>
            <div className="text-sm font-medium">{label}</div>
        </div>
    );
};

export default CategoryBox;  