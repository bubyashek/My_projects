#include "ShipNearPosition.h"

ShipNearPosition::ShipNearPosition()
{
    message = "There is another ship near this position already!";
}

const char *ShipNearPosition::what() const noexcept
{
    return message.c_str();
}