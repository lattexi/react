import { MediaItemWithOwner } from "hybrid-types/DBTypes";

const SingleView = (props: {
  item: MediaItemWithOwner | undefined;
  setSelectedItem: (item: MediaItemWithOwner | undefined) => void;
}) => {
  const { item, setSelectedItem } = props;
  console.log(item);
  return (
    <>
      <button
        onClick={() => {
          setSelectedItem(item);
        }}
      ></button>

      <dialog className="media-dialog" open>
        {item && (
          <>
            <button
              className="close-button"
              onClick={() => setSelectedItem(undefined)}
            >
              Close
            </button>
          </>
        )}
      </dialog>
    </>
  );
};
export default SingleView;
