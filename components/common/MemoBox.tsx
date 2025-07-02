import parse from "html-react-parser";

type Props = {
  text: string;
};

const MemoBox = ({ text }: Props) => {
  return (
    <div className="bg-[#F8F8FA] w-full h-[150px] p-4 text-sm text-black">
      {parse(`${text.replace(/\n/g, "<br/>")}`)}
    </div>
  );
};

export default MemoBox;
