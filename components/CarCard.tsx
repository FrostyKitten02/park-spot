import Card from "@/components/Card";
import {Car} from "@/model/Models";


export default function CarCard(props: {
    car: Car
    marginVertical: number
}) {
    return (
        <Card
            marginVertical={props.marginVertical}
            title={props.car.name??""}
            secondaryText={props.car.registrationPlateNumber??""}
        />
    )
}