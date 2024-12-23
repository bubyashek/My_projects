#pragma once
#include <exception>
#include <string>

class ShipNearPosition : public std::exception
{
    std::string message;

public:
    ShipNearPosition();
    const char *what() const noexcept override;
};