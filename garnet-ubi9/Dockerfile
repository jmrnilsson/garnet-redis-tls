FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

RUN git clone https://github.com/microsoft/garnet.git .
RUN dotnet restore
RUN dotnet build -c Release

WORKDIR /source/main/GarnetServer
RUN dotnet publish -c Release -o /app --self-contained true -f net8.0

FROM registry.access.redhat.com/ubi9/ubi-minimal

WORKDIR /app
COPY --from=build /app .
RUN microdnf install -y libicu

ENTRYPOINT ["/app/GarnetServer", "-i", "128m"]