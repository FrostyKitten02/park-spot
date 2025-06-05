import Card from "@/components/Card";
import {Parked} from "@/model/Models";
import {useRouter} from "expo-router";
import {Alert} from "react-native";
import {ParkedStorage} from "@/storage/ParkedStorage";
import {useSQLiteContext} from "expo-sqlite";


export default function ParkingCard(props: {
    parked: Parked
    marginVertical: number,
    onDelete?: () => void,
    viewOnly?: boolean
}) {
    const db = useSQLiteContext();
    const router = useRouter();


    function getDateTimeStr() {
        const { start, finish } = props.parked;

        if (!start) {
            return "";
        }

        const startStr = start.toLocaleString();

        if (!finish) {
            return startStr;
        }

        const isSameDay =
            start.getFullYear() === finish.getFullYear() &&
            start.getMonth() === finish.getMonth() &&
            start.getDate() === finish.getDate();

        const finishStr = isSameDay
            ? finish.toLocaleTimeString()
            : finish.toLocaleString();

        return `${startStr} - ${finishStr}`;
    }


    const deleteAction = !!props.onDelete && !props.viewOnly;
    return (
        <Card
            onPress={() => {
                const lat = props.parked.location?.latitude;
                const long = props.parked.location?.longitude;
                const parkedId = props.parked.id;

                if (lat == undefined || long == undefined || parkedId == undefined) {
                    Alert.alert(
                        'Error opening parking location',
                        'There was an error opening your parking location.',
                        [
                            {
                                text: 'Ok',
                            },
                        ],
                        {
                            cancelable: true,
                        },
                    );

                    return;
                }

                router.push(`/MapScreen?latitude=${lat}&longitude=${long}&parkedId=${parkedId}`);
            }}
            onDoublePress={()=>{
                if (props.parked.id == undefined || !!props.viewOnly) {
                    return;
                }
                router.push(`/AddParkedModal?parkedId=${props.parked.id}`)
            }}
            marginVertical={props.marginVertical}
            title={props.parked?.car?.name??"Parking"}
            secondaryText={getDateTimeStr()}
            rightActionColor={"#FF3B30"}
            rightActionText={"Delete"}
            rightActionFn={deleteAction?() => {
                Alert.alert(
                    'Delete parking',
                    'Are you sure you want to delete this parking?',
                    [
                        {
                            text: 'Cancel',
                        },
                        {
                            text: 'Delete',
                            onPress: async () => {
                                if (props.parked.id == undefined) {
                                    return;
                                }
                                ParkedStorage.deleteParkedById(db, props.parked.id)
                                props.onDelete!();
                            },
                            style: 'destructive',
                        }
                    ],
                    {
                        cancelable: true,
                    },
                );
            }:undefined}
        />
    )
}