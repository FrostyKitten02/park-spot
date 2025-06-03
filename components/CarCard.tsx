import Card from "@/components/Card";
import {Car} from "@/model/Models";
import {useRouter} from "expo-router";


export default function CarCard(props: {
    car: Car
    marginVertical: number
}) {
    const router = useRouter();

    return (
        <Card
            onPress={() => {
                router.push(`/AddCarModal?carId=${props.car.id}`)
            }}
            marginVertical={props.marginVertical}
            title={props.car.name??""}
            secondaryText={props.car.registrationPlateNumber??""}
        />
    )
}