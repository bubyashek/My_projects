#include "FileWrapper.h"

FileWrapper::FileWrapper(const std::string &fileName) : file(fileName) {}

FileWrapper::~FileWrapper()
{
    if (file.is_open())
    {
        file.close();
    }
}

void FileWrapper::read(nlohmann::json &j)
{
    if (!file.is_open() || !file.good())
    {
        throw std::runtime_error("Unable to open file.");
    }
    file >> j;
}

void FileWrapper::write(nlohmann::json &j)
{
    if (!file.is_open() || !file.good())
    {
        throw std::runtime_error("Unable to open file.");
    }
    file << j.dump(4);
}
