// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: EventService.proto

package etf.unsa.ba.nwt.emajstor.job.event;

public interface EventRequestOrBuilder extends
        // @@protoc_insertion_point(interface_extends:EventRequest)
        com.google.protobuf.MessageOrBuilder {

    /**
     * <code>.google.protobuf.Timestamp date = 1;</code>
     * @return Whether the date field is set.
     */
    boolean hasDate();
    /**
     * <code>.google.protobuf.Timestamp date = 1;</code>
     * @return The date.
     */
    com.google.protobuf.Timestamp getDate();
    /**
     * <code>.google.protobuf.Timestamp date = 1;</code>
     */
    com.google.protobuf.TimestampOrBuilder getDateOrBuilder();

    /**
     * <code>string microservice = 2;</code>
     * @return The microservice.
     */
    String getMicroservice();
    /**
     * <code>string microservice = 2;</code>
     * @return The bytes for microservice.
     */
    com.google.protobuf.ByteString
    getMicroserviceBytes();

    /**
     * <code>string user = 3;</code>
     * @return The user.
     */
    String getUser();
    /**
     * <code>string user = 3;</code>
     * @return The bytes for user.
     */
    com.google.protobuf.ByteString
    getUserBytes();

    /**
     * <code>.EventRequest.actionType action = 4;</code>
     * @return The enum numeric value on the wire for action.
     */
    int getActionValue();
    /**
     * <code>.EventRequest.actionType action = 4;</code>
     * @return The action.
     */
    EventRequest.actionType getAction();

    /**
     * <code>string resource = 5;</code>
     * @return The resource.
     */
    String getResource();
    /**
     * <code>string resource = 5;</code>
     * @return The bytes for resource.
     */
    com.google.protobuf.ByteString
    getResourceBytes();

    /**
     * <code>string status = 6;</code>
     * @return The status.
     */
    String getStatus();
    /**
     * <code>string status = 6;</code>
     * @return The bytes for status.
     */
    com.google.protobuf.ByteString
    getStatusBytes();
}
