"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/reports/status-badge";
import { IssueTypeBadge } from "@/components/reports/issue-type-badge";
import { Eye, MapPin } from "lucide-react";
import type { Report } from "@/lib/types";
import { format } from "date-fns";
import "leaflet/dist/leaflet.css";

interface ReportMapProps {
  reports: Report[];
  onViewReport: (report: Report) => void;
  height?: string;
}

// 🟦 Custom marker icons
const createCustomIcon = (issueType: string, status: string) => {
  const colors = {
    water: "#3b82f6",
    road: "#6b7280",
    electricity: "#eab308",
    sanitation: "#22c55e",
    other: "#a855f7",
  };

  const statusColors = {
    submitted: "#ef4444",
    acknowledged: "#f59e0b",
    in_progress: "#3b82f6",
    resolved: "#10b981",
  };

  const fillColor =
    statusColors[status as keyof typeof statusColors] ||
    colors[issueType as keyof typeof colors] ||
    "#6b7280";

  const innerColor = colors[issueType as keyof typeof colors] || "#6b7280";

  const svg = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${fillColor}"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <circle cx="12.5" cy="12.5" r="3" fill="${innerColor}"/>
    </svg>
  `;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

// 🟩 Custom cluster icon
const createClusterCustomIcon = (cluster: any) => {
  return divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true),
  });
};

export function ReportMap({ reports, onViewReport, height = "500px" }: ReportMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const reportsWithLocation = reports.filter(
    (r) =>
      r.location &&
      typeof r.location.latitude === "number" &&
      typeof r.location.longitude === "number" &&
      !isNaN(r.location.latitude) &&
      !isNaN(r.location.longitude)
  );

  const defaultCenter: [number, number] = [28.6139, 77.209]; // New Delhi

  if (!isClient) {
    return (
      <div
        className="w-full bg-muted rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  if (reportsWithLocation.length === 0) {
    return (
      <div
        className="w-full bg-muted rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            No reports with valid location data found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border">
      <style>{`
        .custom-marker-cluster {
          background: hsl(var(--primary));
          border: 2px solid hsl(var(--background));
          border-radius: 50%;
          color: hsl(var(--primary-foreground));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        }
        .cluster-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
      `}</style>

      <MapContainer
        center={defaultCenter}
        zoom={10}
        style={{ height, width: "100%" }}
        className="z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={50}
        >
          {reportsWithLocation.map((report) => {
            const lat = report.location!.latitude;
            const lng = report.location!.longitude;

            if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng))
              return null;

            return (
              <Marker
                key={report.id}
                position={[lat, lng]}
                icon={createCustomIcon(report.issueType, report.status)}
              >
                <Popup maxWidth={300} className="custom-popup">
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-3">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">
                              {report.issueLabel}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {report.description}
                            </p>
                          </div>
                          {report.imageUrl && (
                            <img
                              src={report.imageUrl || "/placeholder.svg"}
                              alt="Report"
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <IssueTypeBadge issueType={report.issueType} />
                          <StatusBadge status={report.status} />
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <p>
                            Submitted:{" "}
                            {report.createdAt
                              ? format(
                                  report.createdAt.toDate
                                    ? report.createdAt.toDate()
                                    : new Date(report.createdAt),
                                  "MMM dd, yyyy"
                                )
                              : "N/A"}
                          </p>
                          {report.assignedDept && (
                            <p>Dept: {report.assignedDept}</p>
                          )}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => onViewReport(report)}
                          className="w-full"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
